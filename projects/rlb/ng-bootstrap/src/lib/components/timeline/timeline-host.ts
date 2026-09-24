import { IDateTz } from '@open-rlb/date-tz';

/**
 * The slice of `rlb-timeline` that an item talks to.
 *
 * An item is content the caller writes inside the timeline, so it reaches it through its element
 * injector rather than by importing it — the import check in this repo rejects cycles. It asks
 * about itself by identity, because an item does not know where it sits.
 *
 * The format, the locale and the timezone live on the timeline rather than on each item: a list
 * whose entries disagreed about how to write a time would be unreadable.
 */
export abstract class RlbTimelineHost {
  /**
   * The day heading this item should draw above itself, or `null` when the one before it already
   * did. Always `null` when the timeline is not grouping by day.
   */
  abstract dayHeadingFor(item: unknown): string | null;
  /** How this timeline writes a time. */
  abstract timeLabelFor(value: IDateTz): string;
  abstract readonly compact: () => boolean;
}
