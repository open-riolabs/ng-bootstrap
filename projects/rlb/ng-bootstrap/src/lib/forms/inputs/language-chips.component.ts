import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';
import { BadgeComponent } from '../../components/badges/badge.component';

@Component({
  selector: 'rlb-language-chips',
  template: `
    <div class="rlb-language-chips position-relative">
      <div
        class="form-select chips-control d-flex align-items-center gap-1"
        [class.disabled]="isDisabled()"
        [class.is-invalid]="showError() && invalid()"
        [class.is-valid]="showError() && !invalid()"
        role="combobox"
        [attr.aria-expanded]="open()"
        [attr.tabindex]="isDisabled() ? null : 0"
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.space)="toggle(); $event.preventDefault()"
        (blur)="touch()"
      >
        @if (chips().length === 0) {
          <span class="text-muted text-truncate">{{ placeholder() }}</span>
        } @else {
          @for (lang of visibleChips(); track lang) {
            <span
              rlb-badge
              pill
              color="secondary"
              class="chip d-inline-flex align-items-center flex-shrink-0"
            >
              {{ lang }}
            </span>
          }
          @if (overflowCount() > 0) {
            <span class="text-muted small flex-shrink-0">(+{{ overflowCount() }} others)</span>
          }
        }
      </div>

      @if (open() && !isDisabled()) {
        <div
          class="chips-backdrop"
          (click)="close()"
        ></div>
        <div class="dropdown-menu show w-100 chips-menu">
          @for (lang of options(); track lang) {
            <button
              type="button"
              class="dropdown-item d-flex align-items-center gap-2"
              [class.active]="chips().includes(lang)"
              (click)="toggleOption(lang)"
            >
              <input
                type="checkbox"
                class="form-check-input m-0 pe-none flex-shrink-0"
                [checked]="chips().includes(lang)"
                tabindex="-1"
              />
              <span class="text-truncate">{{ lang }}</span>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .chips-control {
      cursor: pointer;
      overflow: hidden;
      flex-wrap: nowrap;
      white-space: nowrap;
      /* Match the natural form-select height so the empty (placeholder) state and
         the chip state (smaller line box) stay the same height. */
      min-height: calc(1.5em + 0.75rem + calc(var(--bs-border-width, 1px) * 2));
    }
    .chips-control.disabled {
      pointer-events: none;
      background-color: var(--bs-secondary-bg);
      opacity: 1;
    }
    .chips-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1040;
    }
    .chips-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1045;
      max-height: 16rem;
      overflow-y: auto;
    }
    .chips-menu .dropdown-item {
      cursor: pointer;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
})
export class LanguageChipsComponent extends AbstractComponent<string[]> {
  readonly options = input<string[]>(['EN', 'IT', 'DE', 'FR', 'ES', 'PT']);
  readonly placeholder = input('Add...');
  /** How many chips to render inline before collapsing the rest into "(+N others)". */
  readonly maxVisible = input(4, { transform: numberAttribute });
  disabled = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id' });

  readonly open = signal(false);
  readonly chips = computed(() => this.value() ?? []);
  readonly visibleChips = computed(() => this.chips().slice(0, this.maxVisible()));
  readonly overflowCount = computed(() => Math.max(0, this.chips().length - this.maxVisible()));
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  toggle(): void {
    if (this.isDisabled()) return;
    this.open.update(o => !o);
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.touch();
  }

  toggleOption(lang: string): void {
    const next = this.chips().includes(lang)
      ? this.chips().filter(l => l !== lang)
      : [...this.chips(), lang];
    this.setValue(next);
    this.touch();
  }
}
