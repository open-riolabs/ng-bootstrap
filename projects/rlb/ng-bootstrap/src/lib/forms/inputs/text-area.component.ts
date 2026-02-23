import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  InputSignal,
  numberAttribute,
  Optional,
  Self,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-textarea',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <textarea
        #field
        [id]="id"
        class="form-control"
        [rows]="rows()"
        [attr.rows]="rows()"
        [attr.disabled]="isDisabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-select-lg]="size() === 'large'"
        [class.form-select-sm]="size() === 'small'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      ></textarea>
      @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()"/>
      }
    </div>
    <ng-content select="[after]"></ng-content>`,
  standalone: false
})
export class TextAreaComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  disabled = input(false, { transform: booleanAttribute }) as unknown as InputSignal<boolean | undefined>;
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);
  rows = input(3, { transform: numberAttribute });
  userDefinedId = input('', { alias: 'id' });

  el = viewChild<ElementRef<HTMLTextAreaElement>>('field');

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
