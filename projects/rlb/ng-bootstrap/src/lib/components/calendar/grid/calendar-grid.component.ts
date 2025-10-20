import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { isSameDay, isToday } from "../utils/calendar-date-utils";
import { IDateTz } from "@open-rlb/date-tz";
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
	selector: 'rlb-calendar-grid',
	templateUrl: './calendar-grid.component.html',
	styleUrls: ['./calendar-grid.component.scss'],
	standalone: false
})
export class CalendarGrid implements OnChanges, OnDestroy {
	@Input() view!: CalendarView;
	@Input() currentDate!: IDateTz;
	@Input() events: CalendarEvent[] = [];
	@Output() eventClick = new EventEmitter<CalendarEvent>();
	
	days: IDateTz[] = [];
	timeSlots: string[] = [];
	
	rowHeight = 100; // px for a full hour slot
	maxBodyHeight: number = 34; // rem
	
	now: DateTz;
	private nowInterval: any;
	private readonly userTimeZone: string;
	
	private _eventsInUserTimeZone: CalendarEvent[] = [];
	
	
	constructor() {
		this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.now = DateTz.now(this.userTimeZone);
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['events'] && this.events) {
			this._eventsInUserTimeZone = this.events.map(event => ({
				...event,
				start: new DateTz(event.start.timestamp, event.start.timezone).convertToTimezone(this.userTimeZone),
				end: new DateTz(event.end.timestamp, event.end.timezone).convertToTimezone(this.userTimeZone)
			}));
		}
		
		if (this.view === 'week') {
			this.buildWeekGrid(this.currentDate);
			this.buildTimeSlots();
		}
	}
	
	ngOnDestroy() {
		this.stopNowTimer();
	}
	
	private startNowTimer() {
		this.nowInterval = setInterval(() => {
			this.now = DateTz.now(this.userTimeZone);
			// this.cdr.detectChanges();
		}, 60 * 1000); // every minute
	}
	
	private stopNowTimer() {
		if (this.nowInterval) {
			clearInterval(this.nowInterval);
		}
	}
	
	getEventsForDate(date: IDateTz) {
		return this.events.filter(e => isSameDay(e.start, date));
	}
	
	private buildWeekGrid(date: IDateTz) {
		const dayOfWeek = date.dayOfWeek!; // 0 = Sunday, 1 = Monday ...
		
		// Week init (monday)
		const start = new DateTz(date.timestamp, date.timezone)
			.add(-(dayOfWeek - 1), 'day'); // clone or create new for start date
		
		this.days = [];
		for (let i = 0; i < 7; i++) {
			this.days.push(new DateTz(start.timestamp, start.timezone).add(i, 'day'));
		}
		this.startNowTimer();
	}
	
	private buildTimeSlots() {
		const slots: string[] = [];
		for (let h = 0; h < 24; h++) {
			slots.push(`${h.toString().padStart(2, '0')}:00`);
		}
		this.timeSlots = slots;
	}
	
	getEventsForHour(day: IDateTz, time: string): CalendarEvent[] {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		
		const startOfHour = new DateTz(day.timestamp, day.timezone)
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const endOfHour = new DateTz(startOfHour.timestamp, startOfHour.timezone).add(1, 'hour');
		
		return this._eventsInUserTimeZone.filter(event => {
			const eventStart = event.start;
			const eventEnd = event.end;
			
			const eventStartsBeforeEndOfHour = eventStart.compare!(endOfHour) < 0; // eventStart < endOfHour
			const eventEndsAfterStartOfHour = eventEnd.compare!(startOfHour) > 0; // eventEnd > startOfHour
			
			return eventStartsBeforeEndOfHour && eventEndsAfterStartOfHour;
		});
	}
	
	calculateEventTop(event: CalendarEvent, time: string): number {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		
		const startOfCurrentHour = new DateTz(event.start.timestamp, event.start.timezone)
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const eventStart = new DateTz(event.start.timestamp, event.start.timezone);
		
		const diffMs = eventStart.timestamp - startOfCurrentHour.timestamp;
		const diffMinutes = diffMs / (1000 * 60);
		
		return (diffMinutes / 60) * this.rowHeight;
	}
	
	calculateEventHeight(event: CalendarEvent): number {
		const eventStart = new DateTz(event.start.timestamp, event.start.timezone);
		const eventEnd = new DateTz(event.end.timestamp, event.end.timezone);
		
		const durationMs = eventEnd.timestamp - eventStart.timestamp;
		const durationMinutes = durationMs / (1000 * 60);
		
		return (durationMinutes / 60) * this.rowHeight;
	}
	
	isCurrentDay(day: IDateTz): boolean {
		return isSameDay(day, this.now);
	}
	
	isToday(date: IDateTz): boolean {
		return isToday(date)
	}
	
	
	isCurrentHour(time: string): boolean {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		return hour === this.now.hour;
	}
	
	calculateNowLineTop(): number {
		const currentMinute = this.now.minute;
		return (currentMinute / 60) * this.rowHeight;
	}
}