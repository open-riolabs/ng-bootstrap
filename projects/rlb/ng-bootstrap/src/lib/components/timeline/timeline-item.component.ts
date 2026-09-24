import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { Color } from '../../shared/types';
import { RlbTimelineHost } from './timeline-host';

/**
 * One entry of an `rlb-timeline`: what happened, when, and whatever detail belongs under it.
 */
@Component({
  selector: 'rlb-timeline-item',
  template: `
    @if (dayHeading(); as heading) {
      <div class="rlb-timeline-day text-body-secondary small fw-semibold text-uppercase">
        {{ heading }}
      </div>
    }

    <div class="rlb-timeline-row d-flex gap-3">
      <div class="rlb-timeline-rail d-flex flex-column align-items-center flex-shrink-0">
        <span
          class="rlb-timeline-dot rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0"
          [class]="dotClass()"
          aria-hidden="true"
        >
          @if (icon()) {
            <i [class]="icon()"></i>
          }
        </span>
        <span class="rlb-timeline-line flex-grow-1"></span>
      </div>

      <div
        class="flex-grow-1"
        [class.pb-4]="!compact()"
        [class.pb-2]="compact()"
      >
        <div class="d-flex flex-wrap align-items-baseline gap-2">
          @if (heading()) {
            <span class="fw-semibold">{{ heading() }}</span>
          }
          @if (timeLabel()) {
            <!-- A time element is only honest with a machine-readable datetime; free text gets a span. -->
            @if (isoTime(); as iso) {
              <time class="text-body-secondary small" [attr.datetime]="iso">{{ timeLabel() }}</time>
            } @else {
              <span class="text-body-secondary small">{{ timeLabel() }}</span>
            }
          }
        </div>
        <div class="text-body-secondary">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: `
    .rlb-timeline-day {
      margin: 0.25rem 0 0.5rem;
      letter-spacing: 0.04em;
    }
    .rlb-timeline-dot {
      width: 1.75rem;
      height: 1.75rem;
      font-size: 0.75rem;
    }
    .rlb-timeline-line {
      width: 2px;
      background: var(--bs-border-color);
      min-height: 0.5rem;
    }
    :host(:last-of-type) .rlb-timeline-line {
      background: transparent;
    }
  `,
  host: { class: 'd-block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineItemComponent {
  private host = inject(RlbTimelineHost, { optional: true });

  /** The line in bold. */
  heading = input<string | undefined>(undefined);
  /**
   * When it happened. An `IDateTz` is formatted by the timeline and used to group by day; a plain
   * string is printed as given and takes no part in grouping.
   */
  time = input<IDateTz | string | undefined>(undefined);
  /** An icon inside the dot. Left out, the dot is a plain circle. */
  icon = input<string | undefined>(undefined);
  color = input<Color>('primary');
  /** Hollows the dot out, for something that has not happened yet. */
  pending = input(false, { transform: booleanAttribute });

  protected compact = computed(() => this.host?.compact() ?? false);
  protected dayHeading = computed(() => this.host?.dayHeadingFor(this) ?? null);

  protected timeLabel = computed(() => {
    const value = this.time();
    if (value === undefined) return '';
    // A string is printed as given; the timeline owns the format for everything else.
    return typeof value === 'string' ? value : (this.host?.timeLabelFor(value) ?? '');
  });

  /**
   * The machine-readable half of `<time>`. Built through date-tz rather than a native `Date`,
   * which this project bans for anything but the library's own internals.
   */
  protected isoTime = computed(() => {
    const value = this.time();
    if (!value || typeof value === 'string') return null;
    return new DateTz(value).toString!('YYYY-MM-DDTHH:mm:ss');
  });

  protected dotClass = computed(() =>
    this.pending()
      ? `border border-2 border-${this.color()} bg-body text-${this.color()}`
      : `bg-${this.color()} text-white`,
  );
}
