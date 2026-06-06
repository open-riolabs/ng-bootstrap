import { DateTz, IDateTz } from '@open-rlb/date-tz';

/** Returns the IANA timezone resolved from the browser/runtime. */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function isSameDay(a: IDateTz, b: IDateTz, timezone?: string): boolean {
  const tz = timezone ?? getBrowserTimezone();
  const da: IDateTz = a.cloneToTimezone!(tz);
  const db: IDateTz = b.cloneToTimezone!(tz);
  return da.year === db.year &&
    da.month === db.month &&
    da.day === db.day;
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

export function isToday(date: IDateTz, timezone?: string): boolean {
  const tz = timezone ?? getBrowserTimezone();
  const d: IDateTz = date.cloneToTimezone!(tz);
  const today: IDateTz = getToday(tz);

  return d.year === today.year &&
    d.month === today.month &&
    d.day === today.day;
}

export function getToday(timezone?: string): DateTz {
  return DateTz.now(timezone ?? getBrowserTimezone());
}
