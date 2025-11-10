import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DateTz } from "@open-rlb/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";
import { addDays, getToday } from "../utils/calendar-date-utils";

@Component({
	selector: 'rlb-calendar-header',
	templateUrl: './calendar-header.component.html',
	styleUrls: ['./calendar-header.component.scss'],
	standalone: false
})
export class CalendarHeaderComponent {
	@Input() view: CalendarView = 'month';
  @Input() currentDate: DateTz = DateTz.now();
  @Output() dateChange = new EventEmitter<DateTz>();
	@Output() viewChange = new EventEmitter<CalendarView>();

	next() {
		switch (this.view) {
			case 'week':
			default:
				const nextWeek = addDays(this.currentDate, 7)
        this.dateChange.emit(new DateTz(nextWeek));
				break;
		}
	}

  prev() {
		switch (this.view) {
			case 'week':
			default:
				const pastWeek = addDays(this.currentDate, -7)
        this.dateChange.emit(new DateTz(pastWeek));
				break;
		}
	}

  today() {
		switch (this.view) {
			case 'week':
			default:
				const today = getToday()
				this.dateChange.emit(today);
				break;
		}
	}
}
