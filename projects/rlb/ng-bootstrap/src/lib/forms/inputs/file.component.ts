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
  selector: 'rlb-file',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: ` <label *ngIf="label" [for]="id" class="form-label">{{
      label
    }}</label>
    <input
      #input
      [id]="id"
      type="file"
      class="form-control"
      [attr.disabled]="disabled ? true : undefined"
      [attr.readonly]="readonly ? true : undefined"
      [attr.multiple]="multiple ? true : undefined"
      [attr.accept]="accept ? accept : undefined"
      [class.form-control-lg]="size === 'large'"
      [class.form-control-sm]="size === 'small'"
      (blur)="touch()"
      [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
      (change)="update($event.target)"
      [value]="value"
    />
    <div class="invalid-feedback">
      {{ errors | json }}
    </div>`,
})
export class FileComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor
{
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input() label?: string = '';
  @Input() size?: 'small' | 'large' | undefined = undefined;
  @Input({ transform: booleanAttribute, alias: 'multiple' }) multiple?:
    | boolean
    | undefined;
  @Input() accept?: string | undefined;

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
