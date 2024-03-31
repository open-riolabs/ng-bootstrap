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
  selector: 'rlb-color',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id"
        class="form-control form-control-color"
        type="color"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
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
export class ColorComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input() size?: 'small' | 'large' | undefined = undefined;
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
