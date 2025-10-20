import { DateTzPipe } from './date-tz.pipe';
import { MonthFormatterPipe } from "./month-formatter.pipe";

export * from './date-tz.pipe';
export * from './month-formatter.pipe'

export const PIPES = [
	DateTzPipe,
	MonthFormatterPipe
];
