import { DateTz, IDateTz } from '@open-rlb/date-tz';

export function isSameDay(a: IDateTz, b: IDateTz): boolean {
	const da = new DateTz(a);
	const db = new DateTz(b);
	return da.year === db.year && da.month === db.month && da.day === db.day;
}

export function isSameMonth(a: IDateTz, b: IDateTz): boolean {
	const da = new DateTz(a);
	const db = new DateTz(b);
	return da.year === db.year && da.month === db.month;
}

export function addDays(date: IDateTz, days: number): DateTz {
	return new DateTz(date).add(days, 'day');
}

export function startOfMonth(date: IDateTz): DateTz {
	const d = new DateTz(date);
	return d.set(1, 'day');
}

export function endOfMonth(date: IDateTz): DateTz {
	const d = new DateTz(date);
	const nextMonth = new DateTz(date).add(1, 'month');
	nextMonth.set(1, 'day');
	return nextMonth.add(-1, 'day');
}

export function isToday(date: IDateTz): boolean {
	const today = DateTz.now();
	return date.year === today.year && date.month === today.month && date.day === today.day;
}