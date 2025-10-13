import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { IDateTz } from "@open-rlb/date-tz";
import { isToday } from "../utils/calendar-date-utils";

@Component({
	selector: 'rlb-calendar-cell',
	templateUrl: './calendar-cell.component.html',
	styleUrls: ['./calendar-cell.component.scss'],
	standalone: false
})
export class CalendarCellComponent {
	@Input() date!: IDateTz;
	@Input() events: CalendarEvent[] = [];
	@Output() eventClick = new EventEmitter<CalendarEvent>();
	
	isToday(): boolean {
		return isToday(this.date)
	}
}