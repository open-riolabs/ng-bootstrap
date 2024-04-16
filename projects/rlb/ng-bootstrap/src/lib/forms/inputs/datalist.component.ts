import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-datalist',
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id"
        class="form-control"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [attr.list]="'list-' + id"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        [value]="value || ''"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <datalist [id]="'list-' + id">
        <ng-content></ng-content>
      </datalist>
      <ng-content select="[after]"></ng-content>
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>`,
})
export class DatalistComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ alias: 'placeholder' }) placeholder?: string;
  @Input({ alias: 'size' }) size?: 'small' | 'large' | undefined = undefined;
  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

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

  override onWrite(data: string): void {
    if (this.el && this.el.nativeElement) {
      this.el.nativeElement.value = data;
    }
  }
}
