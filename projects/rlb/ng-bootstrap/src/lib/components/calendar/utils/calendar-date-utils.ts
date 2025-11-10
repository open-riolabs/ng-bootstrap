import { DateTz, IDateTz } from '@open-rlb/date-tz';

export function isSameDay(a: IDateTz, b: IDateTz): boolean {

	const daInCommonTz = new DateTz(a.timestamp, 'UTC');
	const dbInCommonTz = new DateTz(b.timestamp, 'UTC');

	return daInCommonTz.year === dbInCommonTz.year &&
		daInCommonTz.month === dbInCommonTz.month &&
		daInCommonTz.day === dbInCommonTz.day;
}

export function isSameMonth(a: IDateTz, b: IDateTz): boolean {
	const da = new DateTz(a);
	const db = new DateTz(b);
	return da.year === db.year && da.month === db.month;
}

export function addDays(date: IDateTz, days: number): DateTz {
  return new DateTz(date.add!(days, 'day'));
}

export function startOfMonth(date: IDateTz): DateTz {
	const d = new DateTz(date);
	return d.set(1, 'day');
}

// export function endOfMonth(date: IDateTz): DateTz {
// 	const d = new DateTz(date.timestamp, 'UTC');
// 	return d.add(1, 'month').set(1, 'day').add(-1, 'day');
// }

export function isToday(date: IDateTz): boolean {
	// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const today = DateTz.now();

  const dateInUserTimeZone = new DateTz(date.timestamp, 'UTC');

  return dateInUserTimeZone.year === today.year &&
		dateInUserTimeZone.month === today.month &&
		dateInUserTimeZone.day === today.day;
}

export function getToday(): DateTz {
	//const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const today = DateTz.now('UTC');
	return today
}
