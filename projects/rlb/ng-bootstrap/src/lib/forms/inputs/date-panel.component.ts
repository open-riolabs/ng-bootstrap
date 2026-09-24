import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import {
  dayAt,
  getToday,
  startOfDayTs,
} from '../../components/calendar/utils/calendar-date-utils';
import { RLB_ICONS } from '../../shared/icons';

export interface RlbDateRange {
  start?: IDateTz;
  end?: IDateTz;
}

/**
 * Local midnight of the first of the month containing `d`.
 *
 * Walked day by day through `dayAt` rather than with `set(1, 'day')`, because date-tz's mutators
 * are timezone-naive: `set` would land on the first of the *UTC* month, which is a different day
 * for anyone east of London on the first of the month.
 */
export function firstOfMonth(d: IDateTz, timezone: string): IDateTz {
  const local: IDateTz = d.cloneToTimezone!(timezone);
  return dayAt(local, timezone, -(local.day! - 1));
}

/**
 * The first of the month `delta` months away.
 *
 * 32 days from the first of any month always lands inside the next one (no month is longer than
 * 31 days), and the day before the first is always the last of the previous — so both directions
 * are a day step followed by a re-floor, which `dayAt` makes DST-safe.
 */
export function addMonths(d: IDateTz, timezone: string, delta: number): IDateTz {
  let current = firstOfMonth(d, timezone);
  for (let step = 0; step < Math.abs(delta); step++) {
    current =
      delta > 0
        ? firstOfMonth(dayAt(current, timezone, 32), timezone)
        : firstOfMonth(dayAt(current, timezone, -1), timezone);
  }
  return current;
}

/** The 42 days a month grid shows: six whole weeks, starting on `firstDayOfWeek`. */
export function monthGrid(
  monthStart: IDateTz,
  timezone: string,
  firstDayOfWeek: number,
): IDateTz[] {
  const offset = (monthStart.dayOfWeek! - firstDayOfWeek + 7) % 7;
  const start = dayAt(monthStart, timezone, -offset);
  return Array.from({ length: 42 }, (_, i) => dayAt(start, timezone, i));
}

interface DayCell {
  date: IDateTz;
  label: string;
  ts: number;
  outside: boolean;
  today: boolean;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
}

/**
 * The month grid behind `rlb-datepicker` and `rlb-date-range`.
 *
 * Nothing here holds a value: it is told what is selected and says what was clicked. Both pickers
 * own their own state, which is what lets the range one interpret the second click.
 */
@Component({
  selector: 'rlb-date-panel',
  template: `
    <div
      class="rlb-date-panel card shadow"
      style="min-width: 17rem"
    >
      <div class="card-body p-2">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <button
            type="button"
            class="btn btn-sm btn-link text-reset px-2"
            [attr.aria-label]="previousMonthLabel()"
            (click)="shiftMonth(-1)"
          >
            <i [class]="icons.chevronLeft" aria-hidden="true"></i>
          </button>
          <div
            class="fw-semibold text-capitalize"
            aria-live="polite"
          >
            {{ monthTitle() }}
          </div>
          <button
            type="button"
            class="btn btn-sm btn-link text-reset px-2"
            [attr.aria-label]="nextMonthLabel()"
            (click)="shiftMonth(1)"
          >
            <i [class]="icons.chevronRight" aria-hidden="true"></i>
          </button>
        </div>

        <table
          class="table table-sm mb-0 text-center"
          role="grid"
        >
          <thead>
            <tr>
              @for (name of weekdayNames(); track name) {
                <th
                  scope="col"
                  class="fw-normal text-body-secondary small p-1"
                >
                  {{ name }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (week of weeks(); track $index) {
              <tr>
                @for (cell of week; track cell.ts) {
                  <td class="p-0">
                    <button
                      type="button"
                      class="btn btn-sm w-100 rounded-1 px-0"
                      [class]="cellClass(cell)"
                      [disabled]="cell.disabled"
                      [attr.aria-pressed]="cell.selected"
                      [attr.aria-label]="cell.date.toString!('DD LM yyyy', locale())"
                      (click)="pick(cell)"
                    >
                      {{ cell.label }}
                    </button>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>

        @if (showToday()) {
          <div class="d-grid mt-2">
            <button
              type="button"
              class="btn btn-sm btn-link text-reset"
              (click)="pickToday()"
            >
              {{ todayLabel() }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePanelComponent {
  protected icons = inject(RLB_ICONS);

  timezone = input.required<string>();
  locale = input('en');
  /** 0 is Sunday. Monday by default, which is what most of Europe means by «the week». */
  firstDayOfWeek = input(1, { alias: 'first-day-of-week', transform: numberAttribute });

  /** The day highlighted in single mode. */
  selected = input<IDateTz | undefined>(undefined);
  /** The ends highlighted in range mode, with everything between them shaded. */
  range = input<RlbDateRange | undefined>(undefined);

  min = input<IDateTz | undefined>(undefined);
  max = input<IDateTz | undefined>(undefined);

  showToday = input(true, { alias: 'show-today' });
  todayLabel = input('Today');
  previousMonthLabel = input('Previous month');
  nextMonthLabel = input('Next month');

  daySelected = output<IDateTz>();

  /** The month on screen, which follows the value until the user navigates away from it. */
  private userMonth = signal<IDateTz | undefined>(undefined);

  protected visibleMonth = computed(() => {
    const chosen = this.userMonth();
    if (chosen) return chosen;
    const anchor = this.selected() ?? this.range()?.start ?? getToday(this.timezone());
    return firstOfMonth(anchor, this.timezone());
  });

  protected monthTitle = computed(() =>
    new DateTz(this.visibleMonth()).toString!('LM yyyy', this.locale()),
  );

  protected weekdayNames = computed(() => {
    const tz = this.timezone();
    const start = dayAt(this.visibleMonth(), tz, -((this.visibleMonth().dayOfWeek! - this.firstDayOfWeek() + 7) % 7));
    return Array.from({ length: 7 }, (_, i) =>
      new DateTz(dayAt(start, tz, i)).toString!('WS', this.locale()),
    );
  });

  protected weeks = computed<DayCell[][]>(() => {
    const tz = this.timezone();
    const month = this.visibleMonth();
    const days = monthGrid(month, tz, this.firstDayOfWeek());

    const monthIndex = month.month;
    const todayTs = startOfDayTs(getToday(tz), tz);
    const minTs = this.min() ? startOfDayTs(this.min()!, tz) : undefined;
    const maxTs = this.max() ? startOfDayTs(this.max()!, tz) : undefined;
    const selectedTs = this.selected() ? startOfDayTs(this.selected()!, tz) : undefined;
    const startTs = this.range()?.start ? startOfDayTs(this.range()!.start!, tz) : undefined;
    const endTs = this.range()?.end ? startOfDayTs(this.range()!.end!, tz) : undefined;

    const cells: DayCell[] = days.map(date => {
      const ts = startOfDayTs(date, tz);
      return {
        date,
        ts,
        label: String(date.day),
        outside: date.month !== monthIndex,
        today: ts === todayTs,
        disabled: (minTs !== undefined && ts < minTs) || (maxTs !== undefined && ts > maxTs),
        selected: ts === selectedTs || ts === startTs || ts === endTs,
        inRange: startTs !== undefined && endTs !== undefined && ts > startTs && ts < endTs,
        rangeStart: ts === startTs,
        rangeEnd: ts === endTs,
      };
    });

    return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  });

  protected cellClass(cell: DayCell): string {
    if (cell.selected) return 'btn-primary';
    if (cell.inRange) return 'btn-primary bg-opacity-25 border-0 text-body';
    if (cell.today) return 'btn-outline-primary';
    if (cell.outside) return 'btn-link text-body-secondary opacity-50 text-decoration-none';
    return 'btn-link text-body text-decoration-none';
  }

  protected pick(cell: DayCell) {
    if (cell.disabled) return;
    // Clicking a day of the previous or next month follows it there, as every calendar does.
    if (cell.outside) this.userMonth.set(firstOfMonth(cell.date, this.timezone()));
    this.daySelected.emit(cell.date);
  }

  protected pickToday() {
    const today = getToday(this.timezone());
    const tz = this.timezone();
    const ts = startOfDayTs(today, tz);
    const minTs = this.min() ? startOfDayTs(this.min()!, tz) : undefined;
    const maxTs = this.max() ? startOfDayTs(this.max()!, tz) : undefined;
    if ((minTs !== undefined && ts < minTs) || (maxTs !== undefined && ts > maxTs)) return;
    this.userMonth.set(firstOfMonth(today, tz));
    this.daySelected.emit(dayAt(today, tz, 0));
  }

  protected shiftMonth(delta: number) {
    this.userMonth.set(addMonths(this.visibleMonth(), this.timezone(), delta));
  }

  /** Puts the panel back on the month of whatever is selected. Called when the picker reopens. */
  resetMonth() {
    this.userMonth.set(undefined);
  }
}
