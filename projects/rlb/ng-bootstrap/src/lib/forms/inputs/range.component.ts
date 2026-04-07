import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-range',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
    '[attr.id]': 'null',
  },
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id()"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeComponent extends AbstractComponent<string> {
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

  constructor() {
    super();
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value);
    }
  }

  override onWrite(data: string | undefined): void {
    const el = this.el();
    if (el && el.nativeElement) {
      el.nativeElement.value = data || '';
    }
  }
}
