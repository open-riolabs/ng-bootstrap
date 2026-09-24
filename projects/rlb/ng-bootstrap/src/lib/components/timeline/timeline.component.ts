import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { startOfDayTs } from '../calendar/utils/calendar-date-utils';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RlbTimelineHost } from './timeline-host';
import { TimelineItemComponent } from './timeline-item.component';

/**
 * What happened, in order: an activity feed, an audit log, the history of a record.
 *
 * Recurrent in every console and rewritten every time, usually as a list with a border on one side.
 * Grouping by day is the part worth having in a component: it is where the timezone gets decided,
 * and getting it wrong moves entries into the wrong day for everyone east or west of the server.
 */
@Component({
  selector: 'rlb-timeline',
  template: `<ng-content></ng-content>`,
  host: { class: 'd-block' },
  providers: [{ provide: RlbTimelineHost, useExisting: forwardRef(() => TimelineComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements RlbTimelineHost {
  private dateDefaults = inject(RLB_DEFAULTS).date;

  items = contentChildren(TimelineItemComponent);

  /** Tightens the spacing between entries, for a long log. */
  compactInput = input(false, { alias: 'compact', transform: booleanAttribute });

  /**
   * Puts a heading above the first entry of each day.
   *
   * Only entries whose `time` is an `IDateTz` take part: a plain string has no day the timeline
   * could work out without guessing a format.
   */
  groupByDay = input(false, { alias: 'group-by-day', transform: booleanAttribute });

  /** Left unset, the zone comes from `provideRlbDefaults({ date: { timezone } })`, else UTC. */
  timezone = input<string | undefined>(undefined);
  locale = input('en');
  /** How a time is written beside each entry. */
  timeFormat = input('HH:mm', { alias: 'time-format' });
  /** How a day heading is written. */
  dayFormat = input('WL DD LM yyyy', { alias: 'day-format' });

  readonly compact = computed(() => this.compactInput());

  protected zone = computed(() => this.timezone() ?? this.dateDefaults.timezone);

  timeLabelFor(value: IDateTz): string {
    return new DateTz(value).toString!(this.timeFormat(), this.locale());
  }

  /**
   * The day each entry belongs to, worked out once for the whole list.
   *
   * Local midnight comes from `startOfDayTs`, not from `set(0, 'hour')`: date-tz's mutators are
   * timezone-naive and would put an entry from 00:30 in Rome on the previous day.
   */
  private dayStamps = computed(() => {
    const zone = this.zone();
    return this.items().map(item => {
      const time = item.time();
      if (!time || typeof time === 'string') return null;
      return startOfDayTs(time, zone);
    });
  });

  dayHeadingFor(item: unknown): string | null {
    if (!this.groupByDay()) return null;
    const items = this.items();
    const index = items.indexOf(item as TimelineItemComponent);
    if (index < 0) return null;

    const stamps = this.dayStamps();
    const stamp = stamps[index];
    if (stamp === null) return null;
    // Only the first entry of a day draws the heading.
    if (index > 0 && stamps[index - 1] === stamp) return null;

    return new DateTz(stamp, this.zone()).toString!(this.dayFormat(), this.locale());
  }
}
