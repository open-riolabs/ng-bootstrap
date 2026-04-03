import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-color',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id()"
        class="form-control form-control-color"
        type="color"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [value]="value() || '#000000'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <div class="invalid-feedback">
        @if (errors() && showError()) {
          <rlb-input-validation [errors]="errors()" />
        }
      </div>
    </div>
    <ng-content select="[after]"></ng-content>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorComponent extends AbstractComponent<string> {
  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });

  el = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor() {
    super();
  }

  update(ev: EventTarget | null) {
    if (!this.disabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value);
    }
  }

  override onWrite(data: string | undefined): void {
    const el = this.el();
    if (el && el.nativeElement) {
      el.nativeElement.value = data || '#000000';
    }
  }
}
