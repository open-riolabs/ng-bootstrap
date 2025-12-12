import { IDateTz } from "@open-rlb/date-tz";

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarChangeEvent {
	date: IDateTz,
	view: CalendarView,
}