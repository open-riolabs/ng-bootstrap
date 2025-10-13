import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { isSameDay } from "../utils/calendar-date-utils";
import { IDateTz } from "@open-rlb/date-tz";
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
	selector: 'rlb-calendar-grid',
	templateUrl: './calendar-grid.component.html',
	styleUrls: ['./calendar-grid.component.scss'],
	standalone: false
})
export class CalendarGrid implements OnChanges {
	@Input() view!: CalendarView;
	@Input() currentDate: IDateTz = DateTz.now();
	@Input() events: CalendarEvent[] = [];
	@Output() eventClick = new EventEmitter<CalendarEvent>();
	
	days: IDateTz[] = [];
	
	ngOnChanges() {
		if (this.view === 'week') {
			this.buildWeekGrid();
		}
	}
	
	getEventsForDate(date: IDateTz) {
		return this.events.filter(e => isSameDay(e.start, date));
	}
	
	private buildWeekGrid() {
		const date = new DateTz(this.currentDate);
		const dayOfWeek = date.dayOfWeek; // 0 = Sunday, 1 = Monday ...
		
		// Week init (monday)
		const start = new DateTz(date).add(-(dayOfWeek - 1), 'day');
		
		this.days = [];
		for (let i = 0; i < 7; i++) {
			this.days.push(new DateTz(start).add(i, 'day'));
		}
	}
}