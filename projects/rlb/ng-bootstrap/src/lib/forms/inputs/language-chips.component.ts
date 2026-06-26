import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { AbstractComponent } from './abstract-field.component';
import { SelectComponent } from './select.component';
import { OptionComponent } from './options.component';
import { BadgeComponent } from '../../components/badges/badge.component';

@Component({
  selector: 'rlb-language-chips',
  template: `
    <div class="d-flex flex-column gap-2">
      @if (!isDisabled()) {
        @for (_ of [selectKey()]; track _) {
          <div class="lang-add-select">
            <rlb-select
              [formControl]="addControl"
              [placeholder]="placeholder()"
            >
              @for (lang of options(); track lang) {
                <rlb-option [value]="lang">{{ lang }}</rlb-option>
              }
            </rlb-select>
          </div>
        }
      }
      @if (chips().length > 0) {
        <div class="chips-box form-control d-flex flex-wrap align-items-center gap-2">
          @for (lang of chips(); track lang) {
            <span
              rlb-badge
              pill
              color="secondary"
              class="chip d-inline-flex align-items-center gap-1 mw-100"
            >
              <span class="chip-label">{{ lang }}</span>
              @if (!isDisabled()) {
                <button
                  type="button"
                  class="btn-close btn-close-white btn-close-sm flex-shrink-0"
                  (click)="remove(lang)"
                  [attr.aria-label]="'Remove ' + lang"
                ></button>
              }
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .lang-add-select {
      min-width: 130px;
    }
    .chips-box {
      height: auto;
      max-height: 7.5rem;
      overflow-y: auto;
    }
    .chip-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 12rem;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SelectComponent, OptionComponent, BadgeComponent],
})
export class LanguageChipsComponent extends AbstractComponent<string[]> {
  readonly options = input<string[]>(['EN', 'IT', 'DE', 'FR', 'ES', 'PT']);
  readonly placeholder = input('Add...');
  disabled = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id' });

  readonly selectKey = signal(0);
  readonly chips = computed(() => this.value() ?? []);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  readonly addControl = new FormControl<string | null>(null);

  constructor() {
    super();

    this.addControl.valueChanges.pipe(filter(Boolean), takeUntilDestroyed()).subscribe(lang => {
      this.add(lang);
      this.addControl.setValue(null, { emitEvent: false });
      // Reset the dropdown back to its placeholder after every pick, even when
      // the value was ignored as a duplicate, so the already-selected option
      // doesn't stay stuck as the visible selection.
      this.selectKey.update(k => k + 1);
    });
  }

  add(lang: string): void {
    if (this.chips().includes(lang)) return;
    const next = [...this.chips(), lang];
    this.setValue(next);
    this.touch();
  }

  remove(lang: string): void {
    const next = this.chips().filter(l => l !== lang);
    this.setValue(next);
    this.touch();
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState?.(isDisabled);
    isDisabled ? this.addControl.disable() : this.addControl.enable();
  }
}
