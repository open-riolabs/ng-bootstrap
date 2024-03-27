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
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
      <input
        #input
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
      <ng-content select="[after]"></ng-content>
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
  </div>`,
})
export class CheckboxComponent
  extends AbstractComponent<boolean | undefined>
  implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input() label?: string = '';
  @Input({ transform: booleanAttribute, alias: 'before-text' })
  beforeText?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'indeterminate' })
  indeterminate?: boolean = false;
  @ViewChild('input', { read: ElementRef })
  input!: ElementRef<HTMLInputElement>;

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

  override writeValue(val: boolean | undefined): void {
    if (this.indeterminate && this.input) {
      if (typeof val === 'undefined' || val === null) {
        this.input.nativeElement.indeterminate = true;
      } else {
        this.input.nativeElement.indeterminate = false;
      }
    }
    if (!this.indeterminate) {
      val = val || false;
    }
    super.writeValue(val);
  }
}
