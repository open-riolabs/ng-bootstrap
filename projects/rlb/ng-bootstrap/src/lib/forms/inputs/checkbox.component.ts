import {
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  ViewChild,
  ViewRef,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

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
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [value]="value"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
      <ng-content select="[after]"></ng-content>
    </div>`,
    standalone: false
})
export class CheckboxComponent
  extends AbstractComponent<boolean | undefined>
  implements ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled? = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly? = false;
  @Input({ alias: 'indeterminate', transform: booleanAttribute }) indeterminate?: boolean = false;
  @ViewChild('field', { read: ElementRef }) el!: ElementRef<HTMLInputElement>;

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.checked);
    }
  }

  override onWrite(data: boolean | undefined): void {
    if (this.el && this.el.nativeElement) {
      if (this.indeterminate && (typeof data === 'undefined' || data === null)) {
        this.el.nativeElement.indeterminate = true;
      } else {
        if (data === undefined || data === null) return;
        if (typeof data === 'string') {
          this.el.nativeElement.checked = /^true$/i.test(data);
        }
        else {
          this.el.nativeElement.checked = data;
        }
      }
    }
  }

  override writeValue(val: boolean | undefined): void {
    if (this.indeterminate && this.el) {
      if (typeof val === 'undefined' || val === null) {
        this.el.nativeElement.indeterminate = true;
      } else {
        this.el.nativeElement.indeterminate = false;
      }
    }
    if (!this.indeterminate) {
      val = val || false;
    }
    super.writeValue(val);
  }
}
