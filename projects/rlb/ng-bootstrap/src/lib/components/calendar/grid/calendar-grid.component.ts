import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { isSameDay, isToday } from "../utils/calendar-date-utils";
import { IDateTz } from "@open-rlb/date-tz";
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";
import { ModalService } from "../../modals";

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
	maxBodyHeight: number = 30; // rem
	
	now: DateTz;
	private nowInterval: any;
	
	constructor(
		private modals: ModalService
	) {
		this.now = DateTz.now();
	}
	
	createOrEditEvent() {
		console.log("Event clicked");
		this.modals.openModal('rlb-calendar-event-create-edit', {
			title: 'Demo',
			content: 'This is a demo component',
			ok: 'OK',
			type: 'success',
		}).subscribe((result) => {
			console.log(result);
		})
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['view']) {
			if (this.view === 'week') {
				this.buildWeekGrid(this.currentDate);
				this.buildTimeSlots();
			}
		}
	}
	
	ngOnDestroy() {
		this.stopNowTimer();
	}
	
	private startNowTimer() {
		this.nowInterval = setInterval(() => {
			this.now = DateTz.now();
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
	
	private buildWeekGrid(currentDate: IDateTz) {
		const dayOfWeek = currentDate.dayOfWeek!; // 0 = Sunday, 1 = Monday ...
		
		// Week init (monday)
		const start = new DateTz(currentDate.timestamp, 'UTC')
			.add(-(dayOfWeek - 1), 'day'); // clone or create new for start date
		
		this.days = [];
		for (let i = 0; i < 7; i++) {
			this.days.push(new DateTz(start.timestamp, 'UTC').add(i, 'day'));
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
		
		const startOfHour = new DateTz(day.timestamp, 'UTC')
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const endOfHour = new DateTz(startOfHour.timestamp, 'UTC').add(1, 'hour');
		
		return this.events.filter(event => {
			const eventStart = event.start;
			const eventEnd = event.end;
			
			const eventStartsBeforeEndOfHour = eventStart.compare!(endOfHour) < 0; // eventStart < endOfHour
			const eventEndsAfterStartOfHour = eventEnd.compare!(startOfHour) > 0; // eventEnd > startOfHour
			
			return eventStartsBeforeEndOfHour && eventEndsAfterStartOfHour;
		});
	}
	
	calculateEventTop(event: CalendarEvent, time: string, day: IDateTz): number {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		
		const startOfCurrentHour = new DateTz(day.timestamp, 'UTC')
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const eventStart = event.start;
		const effectiveStartTimestamp = Math.max(eventStart.timestamp, startOfCurrentHour.timestamp);
		const diffMs = effectiveStartTimestamp - startOfCurrentHour.timestamp;
		const diffMinutes = diffMs / (1000 * 60);
		
		return (diffMinutes / 60) * this.rowHeight;
	}
	
	isEventStartInHour(event: CalendarEvent, time: string, day: IDateTz): boolean {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		
		const startOfHour = new DateTz(day.timestamp, 'UTC')
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const endOfHour = new DateTz(startOfHour.timestamp, 'UTC').add(1, 'hour');
		
		const eventStart = event.start;
		
		const startsAfterOrAtStart = eventStart.compare!(startOfHour) >= 0;
		const startsBeforeEnd = eventStart.compare!(endOfHour) < 0;
		
		const startsOnCurrentDay = isSameDay(event.start, day);
		
		return startsOnCurrentDay && startsAfterOrAtStart && startsBeforeEnd;
	}
	
	
	calculateEventHeightInHour(event: CalendarEvent, time: string, day: IDateTz): number {
		const [hourStr] = time.split(':');
		const hour = parseInt(hourStr, 10);
		
		const startOfCurrentHour = new DateTz(day.timestamp, 'UTC')
			.set(hour, 'hour')
			.set(0, 'minute')
		
		const endOfCurrentHour = new DateTz(startOfCurrentHour.timestamp, 'UTC').add(1, 'hour');
		
		const eventStart = event.start;
		const eventEnd = event.end;
		
		const effectiveStartTimestamp = Math.max(eventStart.timestamp, startOfCurrentHour.timestamp);
		
		const effectiveEndTimestamp = Math.min(eventEnd.timestamp, endOfCurrentHour.timestamp);
		
		const durationMs = effectiveEndTimestamp - effectiveStartTimestamp;
		
		if (durationMs <= 0) return 0;
		
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