import {
  booleanAttribute,
  Component,
  ElementRef,
  input,
  Optional,
  Self,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-datalist',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [attr.list]="'list-' + id"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [value]="value || ''"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <datalist [id]="'list-' + id">
        <ng-content></ng-content>
      </datalist>
      @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }
    </div>
    <ng-content select="[after]"></ng-content>
  `,
  standalone: false,
})
export class DatalistComponent extends AbstractComponent<string> implements ControlValueAccessor {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
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
