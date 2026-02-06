import { Component, input, OnDestroy, output } from "@angular/core";
import { IDateTz } from "@open-rlb/date-tz";
import { CalendarEvent } from "../interfaces/calendar-event.interface";
import { CalendarLayout } from "../interfaces/calendar-layout.interface";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
	selector: 'rlb-calendar-grid',
	templateUrl: './calendar-grid.component.html',
	styleUrls: ['./calendar-grid.component.scss'],
	standalone: false,
})
export class CalendarGrid implements OnDestroy {
	view = input.required<CalendarView>();
	currentDate = input.required<IDateTz>();
	events = input<CalendarEvent[]>([]);
	layout = input.required<CalendarLayout>();

	eventClick = output<CalendarEvent | undefined>();
	eventContainerClick = output<CalendarEvent[] | undefined>();
	eventChange = output<CalendarEvent>();

	constructor() { }

	ngOnDestroy() { }
}
