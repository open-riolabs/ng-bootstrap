import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';
import { InputValidationComponent } from './input-validation.component';

/**
 * A number that stays readable while it is being typed.
 *
 * `<input type="number">` throws the formatting away on every keystroke, has a spinner nobody wants
 * and refuses to tell you what a half-typed value is. This keeps a real number in the model and
 * shows it grouped and rounded — but only while the box is not being edited. Formatting a value
 * under the caret moves the caret, which is the single most irritating thing a masked input does.
 */
@Component({
  selector: 'rlb-number',
  template: `
    <div
      class="input-group"
      [class.input-group-sm]="size() === 'small'"
      [class.input-group-lg]="size() === 'large'"
    >
      @if (prefix()) {
        <span class="input-group-text">{{ prefix() }}</span>
      }

      <input
        #field
        type="text"
        class="form-control"
        inputmode="decimal"
        autocomplete="off"
        [id]="id()"
        [value]="display()"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        [style.text-align]="align()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (focus)="onFocus()"
        (input)="onInput($event)"
        (blur)="onBlur($event)"
      />

      @if (suffix()) {
        <span class="input-group-text">{{ suffix() }}</span>
      }
    </div>

    @if (showError()) {
      <rlb-input-validation [errors]="errors()" />
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent],
})
export class NumberComponent extends AbstractComponent<number | null> {
  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });
  enableValidation = input(false, { alias: 'enable-validation', transform: booleanAttribute });

  /** Which locale decides the grouping and the decimal mark. */
  locale = input('en-GB');
  /**
   * An ISO currency code. With one, the value is written as money in `locale` — which is also
   * where the symbol and its position come from, so `EUR` reads «€1,234.50» in en-GB and
   * «1.234,50 €» in it-IT.
   */
  currency = input<string | undefined>(undefined);
  /** Digits after the decimal mark. Left out, a currency uses its own and anything else uses 0–3. */
  decimals = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)),
  });

  min = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)),
  });
  max = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)),
  });

  prefix = input<string | undefined>(undefined);
  suffix = input<string | undefined>(undefined);
  align = input<'left' | 'right'>('right');

  private field = viewChild<ElementRef<HTMLInputElement>>('field');
  /** What the box holds while it is being typed into; `null` when it is not. */
  private raw = signal<string | null>(null);

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private formatter = computed(() => {
    const currency = this.currency();
    const decimals = this.decimals();
    return new Intl.NumberFormat(this.locale(), {
      style: currency ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits: decimals ?? (currency ? undefined : 0),
      maximumFractionDigits: decimals ?? (currency ? undefined : 3),
    });
  });

  /** The characters this locale uses, so what the user typed can be read back. */
  private marks = computed(() => {
    const parts = new Intl.NumberFormat(this.locale()).formatToParts(12345.6);
    return {
      group: parts.find(part => part.type === 'group')?.value ?? ',',
      decimal: parts.find(part => part.type === 'decimal')?.value ?? '.',
    };
  });

  protected display = computed(() => {
    const typing = this.raw();
    if (typing !== null) return typing;

    const value = this.value();
    if (value === null || value === undefined || Number.isNaN(value)) return '';
    return this.formatter().format(value);
  });

  protected onFocus() {
    // Hand back a plain number to edit: grouping marks are a nuisance under the caret.
    const value = this.value();
    this.raw.set(
      value === null || value === undefined || Number.isNaN(value)
        ? ''
        : String(value).replace('.', this.marks().decimal),
    );
  }

  protected onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.raw.set(text);
    this.setValue(this.parse(text));
  }

  protected onBlur(event: Event) {
    const parsed = this.parse((event.target as HTMLInputElement).value);
    const clamped = this.clamp(parsed);
    this.setValue(clamped);
    // Leaving editing mode puts the formatted value back.
    this.raw.set(null);
    this.touch();
  }

  /** Reads a number written the way this locale writes them, and `null` when it is not one. */
  private parse(text: string): number | null {
    const { group, decimal } = this.marks();
    const cleaned = text
      .split(group)
      .join('')
      .replace(decimal, '.')
      .replace(/[^0-9.\-]/g, '');
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private clamp(value: number | null): number | null {
    if (value === null) return null;
    const min = this.min();
    const max = this.max();
    if (min !== undefined && value < min) return min;
    if (max !== undefined && value > max) return max;
    return value;
  }

  override onWrite(): void {
    // A value written from outside is not being typed, so the box goes back to formatted.
    this.raw.set(null);
    const field = this.field();
    if (field) field.nativeElement.value = this.display();
  }
}
