import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  InputSignal,
  Optional,
  Self,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-checkbox',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        class="form-check-input"
        type="checkbox"
        [id]="id"
        [attr.disabled]="isDisabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [value]="value"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      @if (errors() && (control?.touched || control?.dirty)) {
        <div class="invalid-feedback d-block">
          {{ errors() | json }}
        </div>
      }
      <ng-content select="[after]"></ng-content>
    </div>`,
  standalone: false
})
export class CheckboxComponent
  extends AbstractComponent<boolean | undefined>
  implements ControlValueAccessor {
  disabled = input(false, { transform: booleanAttribute }) as unknown as InputSignal<boolean | undefined>;
  readonly = input(false, { transform: booleanAttribute });
  indeterminate = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id' });

  el = viewChild.required<ElementRef<HTMLInputElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
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
        }
        else {
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
    super.writeValue(val);
  }
}
