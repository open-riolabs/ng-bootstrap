import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { IDateTz } from '@open-rlb/date-tz';
import { CalendarEvent } from '../interfaces/calendar-event.interface';
import { CalendarLayout } from '../interfaces/calendar-layout.interface';
import { CalendarView } from '../interfaces/calendar-view.type';
import { CalendarWeekGridComponent } from './week/calendar-week-grid.component';
import { CalendarMonthGridComponent } from './month/calendar-month-grid.component';
import { CalendarDayGridComponent } from './day/calendar-day-grid.component';

@Component({
    selector: 'rlb-calendar-grid',
    templateUrl: './calendar-grid.component.html',
    styleUrls: ['./calendar-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CalendarWeekGridComponent,
        CalendarMonthGridComponent,
        CalendarDayGridComponent,
    ],
})
export class CalendarGrid implements OnDestroy {
  view = input.required<CalendarView>();
  currentDate = input.required<IDateTz>();
  events = input<CalendarEvent[]>([]);
  layout = input.required<CalendarLayout>();

  eventClick = output<CalendarEvent | undefined>({ alias: 'event-click' });
  eventContainerClick = output<CalendarEvent[] | undefined>({ alias: 'event-container-click' });
  eventChange = output<CalendarEvent>({ alias: 'event-change' });

  constructor() {}

  ngOnDestroy() {}
}
