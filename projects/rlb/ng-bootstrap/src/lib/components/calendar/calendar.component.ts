import {
  booleanAttribute,
  Component,
  computed,
  input,
  model,
  output,
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
export class CalendarComponent {
  view = model<CalendarView>('week', { alias: 'view' });

  // Internal mutable copy of events for local modifications
  events = model<CalendarEvent[]>([], { alias: 'events' });

  currentDate = input<IDateTz, IDateTz>(getToday(), {
    alias: 'current-date',
    transform: (d: IDateTz) => new DateTz(d),
  });
  currentDateChange = output<IDateTz>({ alias: 'current-date-change' });

  loading = input(false, { alias: 'loading', transform: booleanAttribute });

  showToolbar = input(true, {
    alias: 'show-toolbar',
    transform: booleanAttribute,
  });

  layout = input<Partial<CalendarLayout>>({}, { alias: 'layout' });

  mergedLayout = computed(() => ({
    ...DEFAULT_CALENDAR_LAYOUT,
    ...this.layout(),
  }));

  dateChange = output<CalendarChangeEvent>({ alias: 'date-change' });
  viewChange = output<CalendarChangeEvent>({ alias: 'view-change' });
  eventClick = output<CalendarEvent>({ alias: 'event-click' });

  constructor(
    private modals: ModalService,
    private unique: UniqueIdService,
    private toasts: ToastService,
  ) {}

  // DnD event
  onEventChange(eventToEdit: CalendarEvent) {
    const currentEvents = [...this.events()];
    const idx = currentEvents.findIndex((event) => event.id === eventToEdit.id);
    if (idx !== -1) {
      currentEvents[idx] = eventToEdit;
      this.events.set(currentEvents);
      this.toasts
        .openToast('toast-c-1', 'rlb-calendar-toast', {
          title: 'Success!',
          content: 'Event edited successfully.',
          type: 'success',
        })
        .pipe(take(1))
        .subscribe();
    }
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
            this.events.set([
              ...this.events().filter((entry) => event.id !== entry.id),
            ]);
            return of({ action: 'delete' });
          }

          if (action === 'edit' && modalResult.reason === 'ok') {
            const currentEvents = [...this.events()];
            const idx = currentEvents.findIndex(
              (entry) => event.id === entry.id,
            );
            if (idx !== -1) {
              currentEvents[idx] = modalResult.result;
              this.events.set(currentEvents);
            }
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
            this.events.set([
              ...this.events().filter((event) => event.id !== eventToEdit.id),
            ]);
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

          const currentEvents = [...this.events()];
          if (eventToEdit) {
            const idx = currentEvents.findIndex(
              (event) => event.id === eventToEdit.id,
            );
            if (idx !== -1) {
              currentEvents[idx] = newEvent;
              result = { action: 'edit' };
            }
          } else {
            currentEvents.push(newEvent);
            result = { action: 'create' };
          }

          this.events.set(currentEvents);
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
    this.currentDateChange.emit(date);
    this.dateChange.emit({ date, view: this.view() });
  }

  setView(view: CalendarView) {
    this.view.set(view);
    this.viewChange.emit({ date: this.currentDate(), view });
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
