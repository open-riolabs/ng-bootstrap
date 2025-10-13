import { CalendarComponent } from "./calendar.component";
import { CalendarHeaderComponent } from "./header/calendar-header.component";
import { CalendarGrid } from "./grid/calendar-grid.component";
import { CalendarCellComponent } from "./cell/calendar-cell.component";
import { CalendarEventComponent } from "./event/calendar-event.component";

export * from './calendar.component';
export * from './header/calendar-header.component';
export * from './grid/calendar-grid.component';
export * from './cell/calendar-cell.component';
export * from './event/calendar-event.component'

export * from './interfaces/calendar-event.interface';


export const CALENDAR_COMPONENTS = [
	CalendarComponent,
	CalendarHeaderComponent,
	CalendarGrid,
	CalendarCellComponent,
	CalendarEventComponent
];