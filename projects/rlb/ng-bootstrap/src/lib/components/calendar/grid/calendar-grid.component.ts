import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from "@angular/core";
import { CalendarEvent, CalendarEventWithLayout } from "../interfaces/calendar-event.interface";
import { IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
	selector: 'rlb-calendar-grid',
	templateUrl: './calendar-grid.component.html',
	styleUrls: ['./calendar-grid.component.scss'],
  standalone: false,
})
export class CalendarGrid implements OnChanges, OnDestroy {
	@Input() view!: CalendarView;
	@Input() currentDate!: IDateTz;
	@Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEventWithLayout[] | undefined>();
  @Output() eventChange = new EventEmitter<CalendarEvent>();

  constructor(
	) {
  }

  ngOnChanges(changes: SimpleChanges) {

	}

  ngOnDestroy() {
	}
}
