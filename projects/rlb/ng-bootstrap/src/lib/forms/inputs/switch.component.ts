import {
  Component,
  Input,
  Optional,
  Self,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-switch',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: `
    <div class="form-check form-switch">
      <ng-content select="[before]"></ng-content>
      <input
        class="form-check-input"
        type="checkbox"
        [id]="id"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [class.form-select-lg]="size === 'large'"
        [class.form-select-sm]="size === 'small'"
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
export class SwitchComponent
  extends AbstractComponent<boolean>
  implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input() label?: string = '';
  @Input({ transform: booleanAttribute, alias: 'before-text' })
  beforeText?: boolean = false;
  @Input() size?: 'small' | 'large' | undefined = undefined;

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
}
