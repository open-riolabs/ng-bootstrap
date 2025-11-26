import { CalendarComponent } from "./calendar.component";
import { CalendarHeaderComponent } from "./header/calendar-header.component";
import { CalendarGrid } from "./grid/calendar-grid.component";
import { CalendarWeekGridComponent } from "./grid/week/calendar-week-grid.component";
import { CalendarEventComponent } from "./event/calendar-event.component";

export * from './calendar.component';
export * from './header/calendar-header.component';
export * from './grid/calendar-grid.component';
export * from './grid/week/calendar-week-grid.component';
export * from './event/calendar-event.component'

export * from './interfaces/calendar-event.interface';


export const CALENDAR_COMPONENTS = [
	CalendarComponent,
	CalendarHeaderComponent,
	CalendarGrid,
  CalendarWeekGridComponent,
  CalendarEventComponent
];
