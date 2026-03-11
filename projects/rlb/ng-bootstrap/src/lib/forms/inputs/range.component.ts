import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  Optional,
  Self,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-range',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-range"
        type="range"
        [attr.disabled]="isDisabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.min]="min()"
        [attr.max]="max()"
        [attr.step]="step()"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <div class="invalid-feedback">
        {{ errors() | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>
  `,
  standalone: false,
})
export class RangeComponent extends AbstractComponent<string> implements ControlValueAccessor {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  min = input(undefined, { transform: numberAttribute });
  max = input(undefined, { transform: numberAttribute });
  step = input(undefined, { transform: numberAttribute });
  userDefinedId = input('', { alias: 'id' });

  el = viewChild.required<ElementRef<HTMLInputElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
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
