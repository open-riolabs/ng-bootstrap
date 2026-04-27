import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';
import { NgClass } from '@angular/common';
import { InputValidationComponent } from './input-validation.component';

@Component({
  selector: 'rlb-checkbox',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        class="form-check-input"
        type="checkbox"
        [id]="id()"
        [attr.disabled]="isDisabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [value]="value()"
        (blur)="touch()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (input)="update($event.target)"
      />
      @if (!_extValidation() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }
      <ng-content select="[after]"></ng-content>
    </div>
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent],
})
export class CheckboxComponent extends AbstractComponent<boolean | undefined> {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  indeterminate = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id' });

  el = viewChild.required<ElementRef<HTMLInputElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  extValidation = input(false, { transform: booleanAttribute });
  enableValidation = input(false, {
    alias: 'enable-validation',
    transform: booleanAttribute,
  });

  protected _forceExtValidation = signal(false);
  protected _extValidation = computed(() => this.extValidation() || this._forceExtValidation());

  setExtValidation(val: boolean) {
    this._forceExtValidation.set(val);
  }

  constructor() {
    super();
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.checked);
    }
  }

  override onWrite(data: boolean | undefined): void {
    const el = this.el();
    if (el && el.nativeElement) {
      if (this.indeterminate() && (typeof data === 'undefined' || data === null)) {
        el.nativeElement.indeterminate = true;
      } else {
        if (data === undefined || data === null) return;
        if (typeof data === 'string') {
          el.nativeElement.checked = /^true$/i.test(data);
        } else {
          el.nativeElement.checked = data;
        }
      }
    }
  }

  override writeValue(val: boolean | undefined): void {
    const el = this.el();
    if (this.indeterminate() && el) {
      if (typeof val === 'undefined' || val === null) {
        el.nativeElement.indeterminate = true;
      } else {
        el.nativeElement.indeterminate = false;
      }
    }
    if (!this.indeterminate()) {
      val = val || false;
    }
    super.writeValue(val as any);
  }
}
