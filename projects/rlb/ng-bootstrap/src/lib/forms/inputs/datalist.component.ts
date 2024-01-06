import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-datalist',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: ` <label *ngIf="label" [for]="id" class="form-label">{{
      label
    }}</label>
    <input
      #input
      [id]="id"
      class="form-control"
      [attr.disabled]="disabled ? true : undefined"
      [attr.readonly]="readonly ? true : undefined"
      [attr.placeholder]="placeholder"
      [attr.list]="'list-' + id"
      [class.form-control-lg]="size === 'large'"
      [class.form-control-sm]="size === 'small'"
      [value]="value"
      (blur)="touch()"
      [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
      (input)="update($event.target)"
    />
    <datalist [id]="'list-' + id">
      <ng-content></ng-content>
    </datalist>
    <div class="invalid-feedback">
      {{ errors | json }}
    </div>`,
})
export class DatalistComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor
{
  @Input() disabled? = false;
  @Input() readonly? = false;
  @Input() label?: string = '';
  @Input() placeholder?: string;
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
      this.setValue(t?.value);
    }
  }
}
