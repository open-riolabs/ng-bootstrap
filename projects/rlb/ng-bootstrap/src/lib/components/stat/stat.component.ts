import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { Color } from '../../shared/types';

/**
 * One number, with what it means and which way it is going.
 *
 * The mattone every dashboard needs and this library had no form of: teams were building it out of
 * a card, two divs and a hand-rolled arrow, differently each time.
 *
 * The value is taken as written. A component cannot know whether 1234.5 is money, a percentage or
 * a count, nor in which locale — so formatting stays with the caller, who does know.
 */
@Component({
  selector: 'rlb-stat',
  template: `
    <div
      class="card h-100"
      [class.border-0]="flat()"
      [class.shadow-sm]="!flat()"
    >
      <div class="card-body d-flex gap-3 align-items-start">
        @if (icon()) {
          <span
            class="rlb-stat-icon d-inline-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            [class]="'bg-' + color() + ' bg-opacity-10 text-' + color()"
          >
            <i [class]="icon()" aria-hidden="true"></i>
          </span>
        }

        <div class="flex-grow-1 min-width-0">
          <div class="text-body-secondary small text-truncate">{{ label() }}</div>

          <div class="d-flex align-items-baseline gap-2 flex-wrap">
            @if (loading()) {
              <span
                class="placeholder col-5 rounded"
                [attr.aria-label]="loadingLabel()"
              ></span>
            } @else {
              <span class="fs-3 fw-semibold lh-1">{{ value() }}</span>

              @if (delta() !== undefined) {
                <!-- Never colour alone: the arrow and the sign carry it too. -->
                <span
                  class="small fw-semibold d-inline-flex align-items-center gap-1"
                  [class]="deltaClass()"
                >
                  <i [class]="deltaIcon()" aria-hidden="true"></i>
                  <span>{{ deltaText() }}</span>
                </span>
              }
            }
          </div>

          @if (deltaLabel()) {
            <div class="text-body-secondary small mt-1">{{ deltaLabel() }}</div>
          }

          <ng-content></ng-content>
        </div>

        @if (sparkline().length > 1) {
          <!-- Decoration: the number and the delta beside it already say what this shows. -->
          <svg
            class="rlb-stat-spark flex-shrink-0"
            [attr.viewBox]="'0 0 100 ' + sparkHeight()"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <polyline
              [attr.points]="sparkPoints()"
              fill="none"
              [attr.stroke]="'var(--bs-' + color() + ')'"
              stroke-width="2"
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
      </div>
    </div>
  `,
  styles: `
    .rlb-stat-icon {
      width: 2.75rem;
      height: 2.75rem;
      font-size: 1.25rem;
    }
    .rlb-stat-spark {
      width: 5rem;
      height: 2.5rem;
    }
    .min-width-0 {
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatComponent {
  protected icons = inject(RLB_ICONS);

  /** What the number is. */
  label = input('');
  /** The number itself, already formatted: `'1.234,5 €'`, `'87%'`, `'12'`. */
  value = input<string | number>('');
  /** An icon class, usually from `RLB_ICONS` or your own set. */
  icon = input<string | undefined>(undefined);
  color = input<Color>('primary');
  /** Drops the shadow and the border, for a tile inside a card that already has one. */
  flat = input(false, { transform: booleanAttribute });

  loading = input(false, { transform: booleanAttribute });
  loadingLabel = input('Loading');

  /** The change, as a number. Its sign decides the arrow and the colour. */
  delta = input<number | undefined>(undefined, { transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)) });
  /** How the change is written. Left out, it is the delta with a sign and a `%`. */
  deltaText_ = input<string | undefined>(undefined, { alias: 'delta-text' });
  /** The line under the number: «vs last month», «in the last 24 h». */
  deltaLabel = input<string | undefined>(undefined, { alias: 'delta-label' });
  /**
   * For the metrics where down is the good news — churn, latency, cost. Swaps which direction is
   * green without touching which arrow is drawn: the arrow says what happened, the colour says
   * whether that is good.
   */
  invertDelta = input(false, { alias: 'invert-delta', transform: booleanAttribute });

  /** A handful of numbers drawn as a line. Decoration; it is never the only place a value lives. */
  sparkline = input<number[]>([]);

  protected sparkHeight = () => 30;

  protected deltaText = computed(() => {
    const own = this.deltaText_();
    if (own !== undefined) return own;
    const delta = this.delta();
    if (delta === undefined) return '';
    return (delta > 0 ? '+' : '') + delta + '%';
  });

  protected deltaIcon = computed(() => {
    const delta = this.delta() ?? 0;
    if (delta > 0) return this.icons.trendUp;
    if (delta < 0) return this.icons.trendDown;
    return this.icons.trendFlat;
  });

  protected deltaClass = computed(() => {
    const delta = this.delta() ?? 0;
    if (delta === 0) return 'text-body-secondary';
    const good = this.invertDelta() ? delta < 0 : delta > 0;
    return good ? 'text-success' : 'text-danger';
  });

  /**
   * The line, normalised into the 0–100 × 0–30 box.
   *
   * A flat series would divide by zero, so it is drawn down the middle instead of vanishing.
   */
  protected sparkPoints = computed(() => {
    const values = this.sparkline();
    if (values.length < 2) return '';
    const height = this.sparkHeight();
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min;
    const step = 100 / (values.length - 1);
    return values
      .map((value, index) => {
        const y = span === 0 ? height / 2 : height - ((value - min) / span) * height;
        return `${(index * step).toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  });
}
