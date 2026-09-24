import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  output,
  viewChildren,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';

/**
 * A code of N characters, one box each.
 *
 * Every two-factor flow needs it and every project writes it again, usually without the two things
 * that make it bearable: pasting the whole code into any box, and Backspace stepping back into the
 * one before when the current box is already empty.
 *
 * The value is the code as a single string, which is what the caller is going to send anyway.
 */
@Component({
  selector: 'rlb-otp',
  template: `
    <div
      class="d-inline-flex gap-2"
      role="group"
      [attr.aria-label]="ariaLabel()"
    >
      @for (slot of slots(); track slot) {
        <input
          #box
          class="form-control text-center rlb-otp-box"
          [class.form-control-lg]="size() === 'large'"
          [class.form-control-sm]="size() === 'small'"
          [type]="mask() ? 'password' : 'text'"
          [attr.inputmode]="alphanumeric() ? 'text' : 'numeric'"
          [attr.autocomplete]="slot === 0 ? 'one-time-code' : 'off'"
          [attr.aria-label]="slotLabel() + ' ' + (slot + 1)"
          maxlength="1"
          [disabled]="isDisabled()"
          [value]="characterAt(slot)"
          (input)="onInput($event, slot)"
          (keydown)="onKeydown($event, slot)"
          (paste)="onPaste($event, slot)"
          (focus)="selectAll($event)"
          (blur)="touch()"
        />
      }
    </div>
  `,
  styles: `
    .rlb-otp-box {
      width: 2.75rem;
      font-variant-numeric: tabular-nums;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpComponent extends AbstractComponent<string> {
  private boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  disabled = input(false, { transform: booleanAttribute });
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });

  length = input(6, { transform: numberAttribute });
  /** Letters as well as digits. Digits only by default, which is what most codes are. */
  alphanumeric = input(false, { transform: booleanAttribute });
  /** Hides the characters, for a code that is really a password. */
  mask = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);
  ariaLabel = input('One-time code');
  slotLabel = input('Digit');

  /** The code is complete. Saves the caller watching the value for a length. */
  completed = output<string>();

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected slots = computed(() => Array.from({ length: this.length() }, (_, i) => i));
  private code = computed(() => (this.value() ?? '').slice(0, this.length()));

  protected characterAt(slot: number): string {
    return this.code()[slot] ?? '';
  }

  private allowed(text: string): string {
    const pattern = this.alphanumeric() ? /[^a-z0-9]/gi : /\D/g;
    return text.replace(pattern, '');
  }

  private write(code: string) {
    const next = code.slice(0, this.length());
    this.setValue(next);
    if (next.length === this.length()) this.completed.emit(next);
  }

  private focusBox(index: number) {
    const box = this.boxes()[Math.max(0, Math.min(this.length() - 1, index))];
    box?.nativeElement.focus();
    box?.nativeElement.select();
  }

  protected selectAll(event: Event) {
    (event.target as HTMLInputElement).select();
  }

  protected onInput(event: Event, slot: number) {
    const element = event.target as HTMLInputElement;
    const typed = this.allowed(element.value);

    if (typed === '') {
      // Rejected character: put the box back rather than leaving it showing something invalid.
      element.value = this.characterAt(slot);
      return;
    }

    const characters = this.code().padEnd(this.length(), ' ').split('');
    characters[slot] = typed[0];
    this.write(characters.join('').trimEnd());
    element.value = typed[0];

    if (slot < this.length() - 1) this.focusBox(slot + 1);
  }

  protected onKeydown(event: KeyboardEvent, slot: number) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const characters = this.code().padEnd(this.length(), ' ').split('');

      if (characters[slot].trim() === '' && slot > 0) {
        // Already empty: clear the one before and go there, which is what everyone expects.
        characters[slot - 1] = ' ';
        this.write(characters.join('').trimEnd());
        this.focusBox(slot - 1);
        return;
      }

      characters[slot] = ' ';
      this.write(characters.join('').trimEnd());
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusBox(slot - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusBox(slot + 1);
    }
  }

  /** A pasted code fills from whichever box it was dropped into, however it was formatted. */
  protected onPaste(event: ClipboardEvent, slot: number) {
    event.preventDefault();
    const pasted = this.allowed(event.clipboardData?.getData('text') ?? '');
    if (!pasted) return;

    const characters = this.code().padEnd(this.length(), ' ').split('');
    for (let i = 0; i < pasted.length && slot + i < this.length(); i++) {
      characters[slot + i] = pasted[i];
    }
    this.write(characters.join('').trimEnd());
    this.focusBox(slot + pasted.length);
  }

  override onWrite(): void {
    // The boxes read from `code()` on the next render; nothing else to push.
  }
}
