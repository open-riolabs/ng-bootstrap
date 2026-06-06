import { DateTz, IDateTz } from '@open-rlb/date-tz';

const MS_PER_DAY = 86_400_000;

/**
 * NOTE on date-tz: the getters (`.hour`, `.minute`, `.day`, `.dayOfWeek`, ...)
 * and `toString()` are timezone-aware (they add `timezoneOffset` to the raw
 * timestamp), but the mutators `set()`, `add()` and `stripSecMillis()` are
 * timezone-NAIVE — they decompose/recompose the raw timestamp as if it were
 * UTC. So `set(0, 'hour')` zeroes the UTC hour, not the local one.
 *
 * For calendar layout we need timezone-aware day math, so the helpers below
 * derive day boundaries and intra-day offsets from the tz-aware side of the
 * library instead of from `set()/add()`.
 */

/** Returns the IANA timezone resolved from the browser/runtime. */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Epoch ms of local midnight (in `timezone`) of the day containing `d`. */
export function startOfDayTs(d: IDateTz, timezone: string): number {
  const local: IDateTz = d.cloneToTimezone!(timezone);
  const localMs = local.timestamp + local.timezoneOffset!;
  return Math.floor(localMs / MS_PER_DAY) * MS_PER_DAY - local.timezoneOffset!;
}

/** Minutes elapsed since local midnight (in `timezone`) for `d`. */
export function minutesSinceMidnight(d: IDateTz, timezone: string): number {
  const local: IDateTz = d.cloneToTimezone!(timezone);
  return local.hour! * 60 + local.minute!;
}

/** Local-midnight instance (in `timezone`) for the day at index `offsetDays` from `d`. */
export function dayAt(d: IDateTz, timezone: string, offsetDays = 0): IDateTz {
  const baseMidnight = startOfDayTs(d, timezone);
  // Re-floor after the raw day shift so DST transitions can't drift the result.
  const shifted: IDateTz = new DateTz(baseMidnight + offsetDays * MS_PER_DAY, timezone);
  return new DateTz(startOfDayTs(shifted, timezone), timezone);
}

export function isSameDay(a: IDateTz, b: IDateTz, timezone?: string): boolean {
  const tz = timezone ?? getBrowserTimezone();
  return startOfDayTs(a, tz) === startOfDayTs(b, tz);
}

export function addDays(date: IDateTz, days: number): IDateTz {
  return new DateTz(date.add!(days, 'day'));
}

export function startOfMonth(date: IDateTz): DateTz {
	const d = new DateTz(date);
	return d.set(1, 'day');
}

export function isToday(date: IDateTz, timezone?: string): boolean {
  const tz = timezone ?? getBrowserTimezone();
  return startOfDayTs(date, tz) === startOfDayTs(getToday(tz), tz);
}

export function getToday(timezone?: string): DateTz {
  return DateTz.now(timezone ?? getBrowserTimezone());
}
