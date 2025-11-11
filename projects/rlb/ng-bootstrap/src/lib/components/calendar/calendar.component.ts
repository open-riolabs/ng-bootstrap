import { booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "./interfaces/calendar-event.interface";
import { DateTz } from "@open-rlb/date-tz";
import { CalendarChangeEvent, CalendarView } from "./interfaces/calendar-view.type";
import { ModalService } from "../modals/modal.service";
import { UniqueIdService } from "../../shared/unique-id.service";
import { take } from "rxjs";
import { getToday } from "./utils/calendar-date-utils";


@Component({
	selector: "rlb-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	standalone: false
})
export class CalendarComponent implements OnChanges {

	@Input({ alias: 'view' }) view: CalendarView = 'week';

	@Input({ alias: 'events' }) events: CalendarEvent[] = [];

  @Input({ alias: 'current-date' }) currentDate: DateTz;

	@Input({ alias: 'loading', transform: booleanAttribute }) loading = false;

	@Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar = true;

  @Output('date-change') dateChange = new EventEmitter<CalendarChangeEvent>();
	@Output('view-change') viewChange = new EventEmitter<CalendarChangeEvent>();
	@Output('event-click') eventClick = new EventEmitter<CalendarEvent>();

  // private userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
	private dateFormat: string = 'YYYY-MM-DD HH:mm:ss';

  constructor(private modals: ModalService, private unique: UniqueIdService) {
    this.currentDate = getToday()
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

  onEventClick(eventToEdit?: CalendarEvent) {
    if (eventToEdit) {
      this.eventClick.emit(eventToEdit)
    }

    this.modals.openModal<CalendarEvent | undefined, CalendarEvent>('rlb-calendar-event-create-edit', {
      title: eventToEdit ? 'Edit event' : 'Create event',
      content: eventToEdit,
      ok: 'OK',
      type: 'success',
    }).pipe(
      take(1)
    ).subscribe((modalResult) => {
      const newEvent = modalResult.result;
      if (modalResult.reason === 'cancel' && eventToEdit) {
        this.events = [...this.events.filter(event => event.id !== eventToEdit.id),]
        return
      }

      if (modalResult.reason === 'cancel' || modalResult.reason === 'close' || modalResult.reason === undefined) {
        return
      }

      if (eventToEdit) {
        const idx = this.events.findIndex((event) => event.id === eventToEdit.id);
        this.events[idx] = newEvent
      } else {
        this.events.push(newEvent)
      }

      this.events = [...this.events];
    })
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
		const events: CalendarEvent[] = [];

    const now = getToday()

    events.push({
      color: 'primary',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).convertToTimezone('UTC').set!(11, 'hour').set!(0, 'minute').stripSecMillis(),
      end: new DateTz(now).convertToTimezone('UTC').set!(12, 'hour').set!(30, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'danger',
      title: 'Today 1h (11:00-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'success',
      title: 'Today 1.5h (11:30-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(30, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'info',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.75h (11:15-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(15, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'secondary',
      title: 'Today 1.75h (10:45-12:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(10, 'hour').set(45, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute').stripSecMillis(),
    });


    events.push({
      color: 'danger',
      title: 'Today 0.5h test 2 (11:30-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(11, 'hour').set(30, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'success',
      title: 'Today 1.75h test 3 (10:15-12:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(10, 'hour').set(15, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.5h test 4 (12:00-13:30)',
      start: new DateTz(now).cloneToTimezone('UTC').set(12, 'hour').set(0, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(13, 'hour').set(30, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'primary',
      title: 'Today 0.5h test 4 (13:30-14:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(13, 'hour').set(30, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(14, 'hour').set(0, 'minute').stripSecMillis(),
    });

    // Today from 15:15 to 16:00

    events.push({
      color: 'danger',
      title: 'Today 45min (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(15, 'hour').set(15, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute').stripSecMillis(),
    });

    events.push({
      color: 'primary',
      title: 'Today 45min 2 (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone('UTC').set(15, 'hour').set(15, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute').stripSecMillis(),
    });


    // === 2. Event "Tomorrow" (currentDate + 1 day) ===
    const tomorrowBase = new DateTz(now).add(1, 'day');
    events.push({
      color: 'info',
      title: 'Tomorrow 2h (09:00-11:00)',
      start: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(9, 'hour').set!(0, 'minute').stripSecMillis(),
      end: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(11, 'hour').set!(0, 'minute').stripSecMillis(),
    });


    // === 3. Event after tomorrow (currentDate + 2 days) ===
    const dayAfterTomorrowBase = new DateTz(now).add(2, 'day');
    events.push({
      color: 'success',
      title: 'After Tomorrow 1h (17:00-18:00)',
      start: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(17, 'hour').set!(0, 'minute').stripSecMillis(),
      end: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(18, 'hour').set!(0, 'minute').stripSecMillis(),
    });


    // === 4. Event (currentDate - 1 day) ===
    const yesterdayBase = new DateTz(now).add(-1, 'day');

    events.push({
      color: 'warning',
      title: 'Yesterday 2h (14:00-16:00)',
      start: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(14, 'hour').set!(0, 'minute').stripSecMillis(),
      end: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(16, 'hour').set!(0, 'minute').stripSecMillis(),
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
}
