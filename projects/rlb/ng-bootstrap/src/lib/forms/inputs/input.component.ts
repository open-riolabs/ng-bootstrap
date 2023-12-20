import { ChangeDetectionStrategy, Component, Input, Optional, Self, booleanAttribute } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from "../../shared/unique-id.service";

@Component({
  selector: 'rlb-input',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto'
  },
  template: `
    <label *ngIf="label" [for]="id" class="form-label">{{ label }}</label>
    <div class="input-group has-validation">
      <input #input
             [id]="id"
             class="form-control" 
             [type]="type" 
             [attr.disabled]="disabled?true:undefined"
             [attr.readonly]="readonly?true:undefined"
             [attr.placeholder]="placeholder"
             [class.form-control-lg]="size === 'large'"
             [class.form-control-sm]="size === 'small'"
             [value]="value"
             (blur)="touch();"
             [ngClass]="{'is-invalid': control?.touched && control?.invalid}"
             (input)="update($event.target);"
             >
        <div class="invalid-feedback">
          {{errors | json }}
        </div>
      </div>`
})
export class InputComponent extends AbstractComponent<string> implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly = false;
  @Input() label: string = '';
  @Input({ transform: booleanAttribute, alias: 'before-text' }) beforeText?: boolean = false
  @Input() type: "text" | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string = 'text'
  @Input() placeholder!: string
  @Input() size: "small" | "large" | undefined = undefined

  constructor(idService: UniqueIdService, @Self() @Optional() override control?: NgControl) {
    super(idService, control)
  }

  update(ev: (EventTarget | null)) {
    if (!this.disabled) {
      const t = (ev as HTMLInputElement)
      this.setValue(t?.value)
    }
  }
}
