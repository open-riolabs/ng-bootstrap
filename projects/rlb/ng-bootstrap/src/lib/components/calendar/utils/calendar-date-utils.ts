import { DateTz, IDateTz } from '@open-rlb/date-tz';

const MS_PER_DAY = 86_400_000;

/**
 * NOTE on date-tz: these helpers derive day boundaries and intra-day offsets from raw timestamps
 * plus `timezoneOffset`. They were written for date-tz 2.x, whose mutators `set()` and `add()`
 * worked on the UTC clock and could not be trusted for local day math. Since date-tz 3 the
 * mutators work on the local wall clock too; the raw-timestamp math below stays correct under
 * both, so it is kept rather than rewritten.
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

/**
 * `date` spostata di `days` giorni, in una nuova DateTz: `add()` di date-tz muta
 * l'istanza su cui è chiamato, quindi si somma su una copia e la data ricevuta
 * (per esempio il `currentDate` del calendario) resta com'era. Da date-tz 3 lo
 * spostamento segue l'orologio locale: domani alla stessa ora, anche a cavallo dell'ora legale.
 */
export function addDays(date: IDateTz, days: number): IDateTz {
  return new DateTz(date).add(days, 'day');
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
