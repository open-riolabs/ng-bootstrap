import { DateTz, IDateTz } from '@open-rlb/date-tz';

export function isSameDay(a: IDateTz, b: IDateTz): boolean {
  return a.yearUTC === b.yearUTC &&
    a.monthUTC === b.monthUTC &&
    a.dayUTC === b.dayUTC;
}

export function addDays(date: IDateTz, days: number): IDateTz {
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
  const today = getToday()

  return date.yearUTC === today.yearUTC &&
    date.monthUTC === today.monthUTC &&
    date.dayUTC === today.dayUTC;
}

export function getToday(): DateTz {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = DateTz.now(timezone);
	return today
}
