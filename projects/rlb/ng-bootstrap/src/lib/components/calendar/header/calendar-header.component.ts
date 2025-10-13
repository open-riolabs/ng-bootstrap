import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
	selector: 'rlb-calendar-header',
	templateUrl: './calendar-header.component.html',
	styleUrls: ['./calendar-header.component.scss'],
	standalone: false
})
export class CalendarHeaderComponent {
	@Input() view: CalendarView = 'month';
	@Input() currentDate: IDateTz = DateTz.now();
	@Output() dateChange = new EventEmitter<IDateTz>();
	@Output() viewChange = new EventEmitter<CalendarView>();
	
	prev() {}
	next() {}
	today() {}
}