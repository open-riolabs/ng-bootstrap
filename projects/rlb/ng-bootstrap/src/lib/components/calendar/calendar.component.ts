import { booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "./interfaces/calendar-event.interface";
import { DateTz } from "@open-rlb/date-tz";
import { CalendarChangeEvent, CalendarView } from "./interfaces/calendar-view.type";
import { ModalService } from "../modals/modal.service";
import { UniqueIdService } from "../../shared/unique-id.service";
import { filter, map, of, switchMap, take } from "rxjs";
import { getToday } from "./utils/calendar-date-utils";
import { ModalResult } from "../modals";
import { CalendarOverflowEventsDialogResult } from "./calendar-dialogs";
import { ToastService } from "../toast";
import { ModalType } from "../../shared/types";


@Component({
	selector: "rlb-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	standalone: false
})
export class CalendarComponent implements OnChanges {

  @Input({ alias: 'view' }) view: CalendarView = 'month';

	@Input({ alias: 'events' }) events: CalendarEvent[] = [];

  @Input({ alias: 'current-date' }) currentDate: DateTz;

	@Input({ alias: 'loading', transform: booleanAttribute }) loading = false;

	@Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar = true;

  @Output('date-change') dateChange = new EventEmitter<CalendarChangeEvent>();
	@Output('view-change') viewChange = new EventEmitter<CalendarChangeEvent>();
	@Output('event-click') eventClick = new EventEmitter<CalendarEvent>();

  // private userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
	private dateFormat: string = 'YYYY-MM-DD HH:mm:ss';

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
	}

  // DnD event
  onEventChange(eventToEdit: CalendarEvent) {
    const idx = this.events.findIndex((event) => event.id === eventToEdit.id);
    this.events[idx] = eventToEdit
    this.events = [...this.events];
    this.toasts.openToast(
      'toast-c-1',
      'rlb-calendar-toast',
      {
        title: 'Success!',
        content: 'Event edited successfully.',
        type: 'success',
      }
    ).pipe(
      take(1)
    ).subscribe()
  }

  onEventContainerClick(events: CalendarEvent[] | undefined) {
    this.modals.openModal(
      'rlb-calendar-overlow-events-container',
      {
        title: 'Overflow events',
        ok: 'OK',
        type: 'success',
        content: events
      }
    ).pipe(
      take(1),
      filter((modalResult: ModalResult<CalendarOverflowEventsDialogResult>) => modalResult.reason === 'ok'),
      switchMap((modalResult) => {
        const action = modalResult.result.action
        const event = modalResult.result.event;
        if (action === 'delete') {
          return this.modals.openConfirmModal(
            "Event delete",
            "Are you sure you want to delete this event?",
            "",
            "Ok",
            "Cancel"
          ).pipe(
            take(1),
            filter((deleteConfirmResult) => deleteConfirmResult.reason === 'ok'),
            map(result => ({ action, modalResult: result, event }))
          )
        } else {
          return this.openEditEventDialog(event).pipe(
            map(result => ({ action, modalResult: result, event }))
          );
        }
      }),
      switchMap(({ action, modalResult, event }) => {
        if (action === 'delete' && modalResult.reason === 'ok' || action === 'edit' && modalResult.reason === 'cancel') {
          this.events = [...this.events.filter(entry => event.id !== entry.id),]
          return of({ action: 'delete' })
        }

        if (action === 'edit' && modalResult.reason === 'ok') {
          const idx = this.events.findIndex((entry) => event.id === entry.id);
          this.events[idx] = modalResult.result;
          this.events = [...this.events];
          return of({ action: 'edit' })
        }

        return of(null)
      }),
      switchMap((result) => {
        if (result) {
          let content = '';
          let type: ModalType = 'success'
          switch (result.action) {
            case 'delete':
              content = 'Event deleted successfully.';
              type = 'warning';
              break;
            case 'edit':
              content = 'Event edited successfully.';
              type = 'info'
              break;
            case 'create':
              content = 'Event created successfully.';
              break;
          }
          return this.toasts.openToast(
            'toast-c-1',
            'rlb-calendar-toast',
            {
              title: 'Success!',
              content,
              type,
            }
          ).pipe(
            take(1)
          )
        }
        return of(null)
      })
    ).subscribe()
  }

  onEventClick(eventToEdit?: CalendarEvent) {
    if (eventToEdit) {
      this.eventClick.emit(eventToEdit)
    }

    this.openEditEventDialog(eventToEdit).pipe(
      switchMap((modalResult) => {
        const newEvent = modalResult.result;
        let result = null
        if (modalResult.reason === 'cancel' && eventToEdit) {
          this.events = [...this.events.filter(event => event.id !== eventToEdit.id),]
          result = { action: 'delete' }
          return of(result)
        }

        if (modalResult.reason === 'cancel' || modalResult.reason === 'close' || modalResult.reason === undefined) {
          return of(result)
        }

        if (eventToEdit) {
          const idx = this.events.findIndex((event) => event.id === eventToEdit.id);
          this.events[idx] = newEvent
          result = { action: 'edit' }
        } else {
          this.events.push(newEvent)
          result = { action: 'create' }
        }

        this.events = [...this.events];
        return of(result)
      }),
      switchMap((result) => {
        if (result) {
          let content = '';
          let type: ModalType = 'success'
          switch (result.action) {
            case 'delete':
              content = 'Event deleted successfully.';
              type = 'warning';
              break;
            case 'edit':
              content = 'Event edited successfully.';
              type = 'info'
              break;
            case 'create':
              content = 'Event created successfully.';
              break;
          }
          return this.toasts.openToast(
            'toast-c-1',
            'rlb-calendar-toast',
            {
              title: 'Success!',
              content,
              type,
            }
          ).pipe(
            take(1)
          )
        }
        return of(null)
      })
    ).subscribe()
  }

  setDate(date: DateTz) {
		this.currentDate = date;
		this.dateChange.emit({ date, view: this.view });
	}

  setView(view: CalendarView) {
		this.view = view;
		this.viewChange.emit({ date: this.currentDate, view })
	}

  generateTestEvents(): void {
    const events: any[] = [];

    const now = getToday()

    events.push({
      color: 'primary',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).convertToTimezone('UTC').set!(11, 'hour').set!(0, 'minute'),
      end: new DateTz(now).convertToTimezone('UTC').set!(12, 'hour').set!(30, 'minute'),
    });

    events.push({
      color: 'danger',
      title: 'Today 1h (11:00-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.5h (11:30-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'info',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.75h (11:15-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'secondary',
      title: 'Today 1.75h (10:45-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(10, 'hour').set(45, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
    });


    events.push({
      color: 'danger',
      title: 'Today 0.5h test 2 (11:30-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.75h test 3 (10:15-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(10, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.5h test 4 (12:00-13:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(13, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 0.5h test 4 (13:30-14:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(13, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(14, 'hour').set(0, 'minute'),
    });

    // Today from 15:15 to 16:00

    events.push({
      color: 'danger',
      title: 'Today 45min (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(15, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 45min 2 (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(15, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute'),
    });


    // === 2. Event "Tomorrow" (currentDate + 1 day) ===
    const tomorrowBase = new DateTz(now).add(1, 'day');
    events.push({
      color: 'info',
      title: 'Tomorrow 2h (09:00-11:00)',
      start: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(9, 'hour').set!(0, 'minute'),
      end: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(11, 'hour').set!(0, 'minute'),
    });


    // === 3. Event after tomorrow (currentDate + 2 days) ===
    const dayAfterTomorrowBase = new DateTz(now).add(2, 'day');
    events.push({
      color: 'success',
      title: 'After Tomorrow 1h (17:00-18:00)',
      start: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(17, 'hour').set!(0, 'minute'),
      end: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(18, 'hour').set!(0, 'minute'),
    });


    // === 4. Event (currentDate - 1 day) ===
    const yesterdayBase = new DateTz(now).add(-1, 'day');

    events.push({
      color: 'warning',
      title: 'Yesterday 2h (14:00-16:00)',
      start: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(14, 'hour').set!(0, 'minute'),
      end: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(16, 'hour').set!(0, 'minute'),
    });

    // === 5. Event "Cross day"  ===
    const dayBeforeYesterdayBase = new DateTz(now).add(-2, 'day');
    const dayBeforeYesterdayEndBase = new DateTz(now).add(-1, 'day');
    events.push({
      color: 'secondary',
      title: 'Cross Day (22:00 -> 02:00)',
      start: new DateTz(dayBeforeYesterdayBase).convertToTimezone('UTC').set!(22, 'hour').set!(0, 'minute').stripSecMillis(),
      end: new DateTz(dayBeforeYesterdayEndBase).convertToTimezone('UTC').set!(2, 'hour').set!(0, 'minute').stripSecMillis(),
    });

    this.events = events.map((event) => {
      return {
        ...event,
        id: this.unique.id
      }
    })
	}

  private openEditEventDialog(eventToEdit?: CalendarEvent) {
    return this.modals.openModal<CalendarEvent | undefined, CalendarEvent>('rlb-calendar-event-create-edit', {
      title: eventToEdit ? 'Edit event' : 'Create event',
      content: eventToEdit,
      ok: 'OK',
      type: 'success',
    }).pipe(
      take(1)
    )
  }
}
