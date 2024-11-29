import {
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
    selector: 'rlb-switch',
    template: `
    <ng-content select="[before]"></ng-content>
    <div class="form-check form-switch d-inline-block">
      <input
        #field
        class="form-check-input"
        type="checkbox"
        [id]="id"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [class.form-select-lg]="size === 'large'"
        [class.form-select-sm]="size === 'small'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>`,
    standalone: false
})
export class SwitchComponent
  extends AbstractComponent<boolean>
  implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly?: boolean;
  @Input({ alias: 'size' }) size?: 'small' | 'large';

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
      this.setValue(t?.checked);
    }
  }

  override onWrite(data: boolean): void {
    if (this.el && this.el.nativeElement) {
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
