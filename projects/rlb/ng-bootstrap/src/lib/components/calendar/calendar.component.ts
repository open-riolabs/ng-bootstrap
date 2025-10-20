import { booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent } from "./interfaces/calendar-event.interface";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "./interfaces/calendar-view.type";

@Component({
	selector: "rlb-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	standalone: false
})
export class CalendarComponent implements OnChanges {
	
	@Input({ alias: 'view' }) view: CalendarView = 'week';
	
	@Input({ alias: 'events' }) events: CalendarEvent[] = [];
	
	@Input({ alias: 'current-date' }) currentDate: IDateTz = DateTz.now();
	
	@Input({ alias: 'loading', transform: booleanAttribute }) loading = false;
	
	@Input({ alias: 'show-toolbar', transform: booleanAttribute }) showToolbar = true;
	
	@Output('date-change') dateChange = new EventEmitter<IDateTz>();
	@Output('view-change') viewChange = new EventEmitter<'month' | 'week' | 'day'>();
	@Output('event-click') eventClick = new EventEmitter<CalendarEvent>();
	
	private readonly userTimeZone: string;
	
	constructor() {
		this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.currentDate = DateTz.now(this.userTimeZone);
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['currentDate']) {
			const incomingDate = changes['currentDate'].currentValue as IDateTz;
			if (incomingDate && incomingDate.timezone !== this.userTimeZone) {
				this.currentDate = new DateTz(incomingDate.timestamp, incomingDate.timezone).convertToTimezone(this.userTimeZone);
			} else if (incomingDate) {
				this.currentDate = incomingDate;
			} else {
				this.currentDate = DateTz.now(this.userTimeZone);
			}
		}
	}
	
	
	setDate(date: IDateTz) {
		this.currentDate = date;
		this.dateChange.emit(date)
	}
	
	setView(view: CalendarView) {
		this.view = view;
		this.viewChange.emit(view)
	}
}