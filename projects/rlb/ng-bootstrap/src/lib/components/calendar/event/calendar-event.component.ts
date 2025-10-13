import { Component, Input } from "@angular/core";
import { CalendarEvent } from "../interfaces/calendar-event.interface";

@Component({
	selector: 'rlb-calendar-event',
	templateUrl: './calendar-event.component.html',
	styleUrls: ['./calendar-event.component.scss'],
	standalone: false
})
export class CalendarEventComponent {
	@Input() event!: CalendarEvent;
}