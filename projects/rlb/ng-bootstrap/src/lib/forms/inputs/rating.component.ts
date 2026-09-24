import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { AbstractComponent } from './abstract-field.component';

/**
 * A score out of `max`, as stars.
 *
 * Small, and asked for more often than it looks. Read-only it is a row of icons with the number
 * beside it for anyone who cannot see them; writable it is a real slider as far as the keyboard is
 * concerned — arrows change the value, Home and End take the ends.
 */
@Component({
  selector: 'rlb-rating',
  template: `
    <div
      class="d-inline-flex align-items-center gap-2"
      [attr.role]="readonly() ? 'img' : 'slider'"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-valuemin]="readonly() ? null : 0"
      [attr.aria-valuemax]="readonly() ? null : max()"
      [attr.aria-valuenow]="readonly() ? null : current()"
      [attr.aria-valuetext]="valueText()"
      [attr.tabindex]="readonly() || isDisabled() ? null : 0"
      (keydown)="onKeydown($event)"
      (mouseleave)="hover.set(null)"
      (blur)="touch()"
    >
      <span class="rlb-rating-stars d-inline-flex">
        @for (index of indexes(); track index) {
          <span
            class="rlb-rating-star"
            [class.rlb-rating-interactive]="!readonly() && !isDisabled()"
            [class]="index <= shown() ? 'text-' + color() : 'text-body-secondary opacity-50'"
            (mouseenter)="onHover(index)"
            (click)="choose(index)"
            aria-hidden="true"
          >
            <i [class]="index <= shown() ? icons.starFilled : icons.star"></i>
          </span>
        }
      </span>

      @if (showValue()) {
        <span class="text-body-secondary small">{{ valueText() }}</span>
      }
    </div>
  `,
  styles: `
    .rlb-rating-star {
      line-height: 1;
      padding: 0 0.0625rem;
    }
    .rlb-rating-interactive {
      cursor: pointer;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent extends AbstractComponent<number> {
  protected icons = inject(RLB_ICONS);

  disabled = input(false, { transform: booleanAttribute });
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });

  max = input(5, { transform: numberAttribute });
  readonly = input(false, { transform: booleanAttribute });
  color = input('warning');
  /** Shows «3 / 5» beside the stars. */
  showValue = input(false, { alias: 'show-value', transform: booleanAttribute });
  /** Clicking the star that is already chosen clears the score. */
  clearable = input(true, { transform: booleanAttribute });
  ariaLabel = input('Rating');

  protected hover = signal<number | null>(null);

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected current = computed(() => this.value() ?? 0);
  protected indexes = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));
  /** What is drawn: the hovered score while the pointer is over it, the real one otherwise. */
  protected shown = computed(() => this.hover() ?? this.current());
  protected valueText = computed(() => `${this.current()} / ${this.max()}`);

  protected onHover(index: number) {
    if (this.readonly() || this.isDisabled()) return;
    this.hover.set(index);
  }

  choose(index: number) {
    if (this.readonly() || this.isDisabled()) return;
    const next = this.clearable() && this.current() === index ? 0 : index;
    this.setValue(next);
    this.touch();
  }

  protected onKeydown(event: KeyboardEvent) {
    if (this.readonly() || this.isDisabled()) return;

    // The pointer may still be resting on a star from an earlier click. Once the keyboard has the
    // value, that preview is stale: the stars would show one score while aria-valuenow said another.
    this.hover.set(null);

    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -1
          : 0;

    if (step !== 0) {
      event.preventDefault();
      const next = Math.min(this.max(), Math.max(0, this.current() + step));
      this.setValue(next);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.setValue(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.setValue(this.max());
    }
  }
}
