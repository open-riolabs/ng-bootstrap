import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { filter, map, of, switchMap, take } from 'rxjs';
import { ModalType } from '../../shared/types';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ModalResult } from '../modals';
import { ModalService } from '../modals/modal.service';
import { ToastService } from '../toast';
import { CalendarOverflowEventsDialogResult } from './calendar-dialogs';
import { CalendarEvent } from './interfaces/calendar-event.interface';
import {
  CalendarLayout,
  DEFAULT_CALENDAR_LAYOUT,
} from './interfaces/calendar-layout.interface';
import {
  CalendarChangeEvent,
  CalendarView,
} from './interfaces/calendar-view.type';
import { getToday } from './utils/calendar-date-utils';

@Component({
  selector: 'rlb-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false,
})
export class CalendarComponent implements OnChanges {
  @Input({ alias: 'view' }) view: CalendarView = 'week';

  @Input({ alias: 'events' }) events: CalendarEvent[] = [];

  @Input({ alias: 'current-date', transform: (d: IDateTz) => new DateTz(d) })
  currentDate: IDateTz;

  @Input({ alias: 'loading', transform: booleanAttribute }) loading = false;

  @Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar =
    true;
  @Input({ alias: 'layout' }) layout: Partial<CalendarLayout> = {};

  mergedLayout: CalendarLayout = DEFAULT_CALENDAR_LAYOUT;

  @Output('date-change') dateChange = new EventEmitter<CalendarChangeEvent>();
  @Output('view-change') viewChange = new EventEmitter<CalendarChangeEvent>();
  @Output('event-click') eventClick = new EventEmitter<CalendarEvent>();

  constructor(
    private modals: ModalService,
    private unique: UniqueIdService,
    private toasts: ToastService,
  ) {
    this.currentDate = getToday();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentDate']) {
      const incomingDate = changes['currentDate'].currentValue as DateTz;
      this.currentDate = incomingDate;
    }

    if (changes['events']) {
      this.events = changes['events'].currentValue as CalendarEvent[];
    }

    if (changes['layout']) {
      this.mergedLayout = { ...DEFAULT_CALENDAR_LAYOUT, ...this.layout };
    }
  }

  // DnD event
  onEventChange(eventToEdit: CalendarEvent) {
    const idx = this.events.findIndex((event) => event.id === eventToEdit.id);
    this.events[idx] = eventToEdit;
    this.events = [...this.events];
    this.toasts
      .openToast('toast-c-1', 'rlb-calendar-toast', {
        title: 'Success!',
        content: 'Event edited successfully.',
        type: 'success',
      })
      .pipe(take(1))
      .subscribe();
  }

  onEventContainerClick(events: CalendarEvent[] | undefined) {
    this.modals
      .openModal('rlb-calendar-overlow-events-container', {
        title: 'Overflow events',
        ok: 'OK',
        type: 'success',
        content: events,
      })
      .pipe(
        take(1),
        filter(
          (modalResult: ModalResult<CalendarOverflowEventsDialogResult>) =>
            modalResult.reason === 'ok',
        ),
        switchMap((modalResult) => {
          const action = modalResult.result.action;
          const event = modalResult.result.event;
          if (action === 'delete') {
            return this.modals
              .openConfirmModal(
                'Event delete',
                'Are you sure you want to delete this event?',
                '',
                'Ok',
                'Cancel',
              )
              .pipe(
                take(1),
                filter(
                  (deleteConfirmResult) => deleteConfirmResult.reason === 'ok',
                ),
                map((result) => ({ action, modalResult: result, event })),
              );
          } else {
            return this.openEditEventDialog(event).pipe(
              map((result) => ({ action, modalResult: result, event })),
            );
          }
        }),
        switchMap(({ action, modalResult, event }) => {
          if (
            (action === 'delete' && modalResult.reason === 'ok') ||
            (action === 'edit' && modalResult.reason === 'cancel')
          ) {
            this.events = [
              ...this.events.filter((entry) => event.id !== entry.id),
            ];
            return of({ action: 'delete' });
          }

          if (action === 'edit' && modalResult.reason === 'ok') {
            const idx = this.events.findIndex((entry) => event.id === entry.id);
            this.events[idx] = modalResult.result;
            this.events = [...this.events];
            return of({ action: 'edit' });
          }

          return of(null);
        }),
        switchMap((result) => {
          if (result) {
            let content = '';
            let type: ModalType = 'success';
            switch (result.action) {
              case 'delete':
                content = 'Event deleted successfully.';
                type = 'warning';
                break;
              case 'edit':
                content = 'Event edited successfully.';
                type = 'info';
                break;
              case 'create':
                content = 'Event created successfully.';
                break;
            }
            return this.toasts
              .openToast('toast-c-1', 'rlb-calendar-toast', {
                title: 'Success!',
                content,
                type,
              })
              .pipe(take(1));
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  onEventClick(eventToEdit?: CalendarEvent) {
    if (eventToEdit) {
      this.eventClick.emit(eventToEdit);
    }

    this.openEditEventDialog(eventToEdit)
      .pipe(
        switchMap((modalResult) => {
          const newEvent = modalResult.result;
          let result = null;
          if (modalResult.reason === 'cancel' && eventToEdit) {
            this.events = [
              ...this.events.filter((event) => event.id !== eventToEdit.id),
            ];
            result = { action: 'delete' };
            return of(result);
          }

          if (
            modalResult.reason === 'cancel' ||
            modalResult.reason === 'close' ||
            modalResult.reason === undefined
          ) {
            return of(result);
          }

          if (eventToEdit) {
            const idx = this.events.findIndex(
              (event) => event.id === eventToEdit.id,
            );
            this.events[idx] = newEvent;
            result = { action: 'edit' };
          } else {
            this.events.push(newEvent);
            result = { action: 'create' };
          }

          this.events = [...this.events];
          return of(result);
        }),
        switchMap((result) => {
          if (result) {
            let content = '';
            let type: ModalType = 'success';
            switch (result.action) {
              case 'delete':
                content = 'Event deleted successfully.';
                type = 'warning';
                break;
              case 'edit':
                content = 'Event edited successfully.';
                type = 'info';
                break;
              case 'create':
                content = 'Event created successfully.';
                break;
            }
            return this.toasts
              .openToast('toast-c-1', 'rlb-calendar-toast', {
                title: 'Success!',
                content,
                type,
              })
              .pipe(take(1));
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  setDate(date: DateTz) {
    this.currentDate = date;
    this.dateChange.emit({ date, view: this.view });
  }

  setView(view: CalendarView) {
    this.view = view;
    this.viewChange.emit({ date: this.currentDate, view });
  }

  private openEditEventDialog(eventToEdit?: CalendarEvent) {
    return this.modals
      .openModal<CalendarEvent | undefined, CalendarEvent>(
        'rlb-calendar-event-create-edit',
        {
          title: eventToEdit ? 'Edit event' : 'Create event',
          content: eventToEdit,
          ok: 'OK',
          type: 'success',
        },
      )
      .pipe(take(1));
  }
}
