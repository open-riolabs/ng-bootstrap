import { booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "./interfaces/calendar-event.interface";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarChangeEvent, CalendarView } from "./interfaces/calendar-view.type";

@Component({
	selector: "rlb-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	standalone: false
})
export class CalendarComponent implements OnChanges {
	
	@Input({ alias: 'view' }) view: CalendarView = 'week';
	
	@Input({ alias: 'events' }) events: CalendarEvent[] = [];
	
	@Input({ alias: 'current-date' }) currentDate: IDateTz;
	
	@Input({ alias: 'loading', transform: booleanAttribute }) loading = false;
	
	@Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar = true;
	
	@Output('date-change') dateChange = new EventEmitter<CalendarChangeEvent>();
	@Output('view-change') viewChange = new EventEmitter<CalendarChangeEvent>();
	@Output('event-click') eventClick = new EventEmitter<CalendarEvent>();
	
	// private userTimeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
	private dateFormat: string = 'YYYY-MM-DD HH:mm:ss';
	
	constructor() {
		this.currentDate = DateTz.now();
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['currentDate']) {
			const incomingDate = changes['currentDate'].currentValue as IDateTz;
			this.currentDate = incomingDate;
		}
		
		if (changes['events']) {
			this.events = changes['events'].currentValue as CalendarEvent[];
		}
	}
	
	
	setDate(date: IDateTz) {
		this.currentDate = date;
		this.dateChange.emit({ date, view: this.view });
	}
	
	setView(view: CalendarView) {
		this.view = view;
		this.viewChange.emit({ date: this.currentDate, view })
	}
	
	generateTestEvents(): void {
		const events: CalendarEvent[] = [];
		
		const now = DateTz.now();
		
		events.push({
			color: 'primary',
			title: 'Today 1.5h (11:00-12:30)',
			start: now.cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute'),
			end: now.cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
		});
		
		// TODO: Understand, how to handle multiple events in same hour
		
		// events.push({
		// 	color: 'danger',
		// 	title: 'Today 1.5h test 2 (11:00-12:30)',
		// 	start: now.cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute'),
		// 	end: now.cloneToTimezone('UTC').set(12, 'hour').set(30, 'minute'),
		// });
		
		// Today from 15:15 ti 16:00
		events.push({
			color: 'danger',
			title: 'Today 45min (15:15-16:00)',
			start: now.cloneToTimezone('UTC').set(15, 'hour').set(15, 'minute'),
			end: now.cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute'),
		});
		
		
		// === 2. Event "Tomorrow" (currentDate + 1 day) ===
		const tomorrow = now.cloneToTimezone('UTC').add(1, 'day');
		events.push({
			color: 'info',
			title: 'Tomorrow 2h (09:00-11:00)',
			start: tomorrow.cloneToTimezone('UTC').set(9, 'hour').set(0, 'minute'),
			end: tomorrow.cloneToTimezone('UTC').set(11, 'hour').set(0, 'minute'),
		});
		
		
		// === 3. Event after tomorrow (currentDate + 2 days) ===
		const dayAfterTomorrow = now.cloneToTimezone('UTC').add(2, 'day');
		events.push({
			color: 'success',
			title: 'After Tomorrow 1h (17:00-18:00)',
			start: dayAfterTomorrow.cloneToTimezone('UTC').set(17, 'hour').set(0, 'minute'),
			end: dayAfterTomorrow.cloneToTimezone('UTC').set(18, 'hour').set(0, 'minute'),
		});
		
		
		// === 4. Event (currentDate - 1 day) ===
		const yesterday = now.cloneToTimezone('UTC').add(-1, 'day');
		events.push({
			color: 'warning',
			title: 'Yesterday 2h (14:00-16:00)',
			start: yesterday.cloneToTimezone('UTC').set(14, 'hour').set(0, 'minute'),
			end: yesterday.cloneToTimezone('UTC').set(16, 'hour').set(0, 'minute'),
		});
		
		// === 5. Event "Cross day"  ===
		const dayBeforeYesterday = now.cloneToTimezone('UTC').add(-2, 'day');
		const dayBeforeYesterdayEnd = now.cloneToTimezone('UTC').add(-1, 'day');
		events.push({
			color: 'secondary',
			title: 'Cross Day (22:00 -> 02:00)',
			start: dayBeforeYesterday.cloneToTimezone('UTC').set(22, 'hour').set(0, 'minute'),
			end: dayBeforeYesterdayEnd.cloneToTimezone('UTC').set(2, 'hour').set(0, 'minute'),
		});
		
		this.events = events
	}
}