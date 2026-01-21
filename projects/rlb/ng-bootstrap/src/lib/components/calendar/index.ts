import { CalendarComponent } from "./calendar.component";
import { CalendarEventComponent } from "./event/calendar-event.component";
import { CalendarGrid } from "./grid/calendar-grid.component";
import { CalendarDayGridComponent } from "./grid/day/calendar-day-grid.component";
import { CalendarMonthGridComponent } from "./grid/month/calendar-month-grid.component";
import { CalendarWeekGridComponent } from "./grid/week/calendar-week-grid.component";
import { CalendarHeaderComponent } from "./header/calendar-header.component";

export * from './calendar.component';
export * from './event/calendar-event.component';
export * from './grid/calendar-grid.component';
export * from './grid/day/calendar-day-grid.component';
export * from './grid/month/calendar-month-grid.component';
export * from './grid/week/calendar-week-grid.component';
export * from './header/calendar-header.component';

export * from './interfaces/calendar-event.interface';


export const CALENDAR_COMPONENTS = [
  CalendarComponent,
  CalendarHeaderComponent,
  CalendarGrid,
  CalendarWeekGridComponent,
  CalendarDayGridComponent,
  CalendarMonthGridComponent,
  CalendarEventComponent
];
