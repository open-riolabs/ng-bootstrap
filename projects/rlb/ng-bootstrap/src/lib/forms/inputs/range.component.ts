import { ChangeDetectionStrategy, Component, Input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from "../../shared/unique-id.service";

@Component({
  selector: 'rlb-range',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto'
  },
  template: `
  <label *ngIf="label" [for]="id" class="form-label">{{ label }}</label>
  <input #input
         [id]="id"
         class="form-range" 
         type="range" 
         [attr.disabled]="disabled?true:undefined"
         [attr.readonly]="readonly?true:undefined"
         [attr.min]="min"
         [attr.max]="max"
         [attr.step]="step"
         [value]="value"
         (blur)="touch();"
         [ngClass]="{'is-invalid': control?.touched && control?.invalid}"
         (input)="update($event.target);">
  <div class="invalid-feedback">
    {{ errors | json }}
  </div>`
})
export class RangeComponent extends AbstractComponent<string> implements ControlValueAccessor {
  @Input() disabled? = false;
  @Input() readonly? = false;
  @Input() label?: string = '';
  @Input() min?: number | undefined = undefined
  @Input() max?: number | undefined = undefined
  @Input() step?: number | undefined = undefined

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
