import { booleanAttribute, Component, EventEmitter, Input, Output } from "@angular/core";
import { CalendarEvent } from "./interfaces/calendar-event.interface";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "./interfaces/calendar-view.type";

@Component({
	selector: "rlb-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	standalone: false
})
export class CalendarComponent {
	
	@Input({ alias: 'view' }) view: CalendarView = 'week';
	
	@Input({ alias: 'events' }) events: CalendarEvent[] = [];
	
	@Input({ alias: 'current-date' }) currentDate: IDateTz = DateTz.now();
	
	@Input({ alias: 'loading', transform: booleanAttribute }) loading = false;
	
	@Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar = true;
	
	@Output('date-change') dateChange = new EventEmitter<IDateTz>();
	@Output('view-change') viewChange = new EventEmitter<'month' | 'week' | 'day'>();
	@Output('event-click') eventClick = new EventEmitter<CalendarEvent>();
	
	constructor() {
	}
	
	next() {   }
	prev() {   }
	today() {   }
	setView(view: CalendarView) {
		this.view = view;
		this.viewChange.emit(view)
	}
}