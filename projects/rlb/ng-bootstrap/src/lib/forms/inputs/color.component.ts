import {
  booleanAttribute,
  Component,
  ElementRef,
  input,
  InputSignal,
  Optional,
  Self,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-color',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control form-control-color"
        type="color"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [value]="value"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <div class="invalid-feedback">
        @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()"/>
      }
      </div>
    </div>
    <ng-content select="[after]"></ng-content>`,
  standalone: false
})
export class ColorComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  disabled = input(false, { transform: booleanAttribute }) as unknown as InputSignal<boolean | undefined>;
  readonly = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });

  el = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value);
    }
  }

  override onWrite(data: string): void {
    const el = this.el();
    if (el && el.nativeElement) {
      el.nativeElement.value = data;
    }
  }
}
