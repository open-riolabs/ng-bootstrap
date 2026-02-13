import {
  booleanAttribute,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  InputSignal,
  numberAttribute,
  Optional,
  Self,
  untracked,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { OptionComponent } from './options.component';

@Component({
  selector: 'rlb-select',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <select
        #select
        class="form-select d-inline-block"
        [id]="id"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.multiple]="multiple() ? true : undefined"
        [class.form-select-lg]="size() === 'large'"
        [class.form-select-sm]="size() === 'small'"
        [attr.placeholder]="placeholder()"
        [attr.size]="display()"
        (blur)="touch()"
        [class.is-invalid]="control?.touched && control?.invalid && enableValidation()"
        [class.is-valid]="control?.touched && control?.valid && enableValidation()"
        (change)="update($event.target)"
        >
        @if (placeholder()) {
          <option selected disabled>{{ placeholder() }}</option>
        }
        <ng-container #projectedDisplayOptions></ng-container>
      </select>
      @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()"/>
      }
    </div>
    <ng-content select="[after]"></ng-content>`,
  standalone: false
})
export class SelectComponent
  extends AbstractComponent<string | string[]>
  implements ControlValueAccessor {

  placeholder = input<string | undefined>(undefined, { alias: 'placeholder' });
  size = input<'small' | 'large' | undefined>(undefined, { alias: 'size' });
  // Cast to specific InputSignal type to satisfy AbstractComponent which expects boolean | undefined
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute }) as unknown as InputSignal<boolean | undefined>;
  readonly = input(false, { alias: 'readonly', transform: booleanAttribute });
  multiple = input(false, { alias: 'multiple', transform: booleanAttribute });
  display = input<number, unknown>(undefined, { alias: 'display', transform: numberAttribute });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' }) as unknown as InputSignal<string>; // Abstract expects InputSignal<string> strictly, but inference might vary
  enableValidation = input(false, { transform: booleanAttribute, alias: 'enable-validation' });

  el = viewChild.required<ElementRef<HTMLSelectElement>>('select');
  _projectedDisplayOptions = viewChild.required<ViewContainerRef>('projectedDisplayOptions');
  options = contentChildren(OptionComponent);

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);

    effect(() => {
      const vcr = this._projectedDisplayOptions();
      const options = this.options();

      vcr.clear();
      options.forEach(opt => {
        vcr.insert(opt._view);
      });

      untracked(() => {
        this.onWrite(this.value);
      });
    });
  }

  update(ev: EventTarget | null) {
    if (!this.disabled()) {
      const t = ev as HTMLSelectElement;
      if (this.multiple()) {
        const selected = Array.from(t.selectedOptions)
          .filter((o) => o.selected)
          .map((o) => o.value);
        this.setValue(selected);
      } else {
        this.setValue(t?.value);
      }
    }
  }

  override onWrite(data: string | string[]): void {
    const el = this.el?.();
    if (el && el.nativeElement) {
      if (this.multiple()) {
        if (!Array.isArray(data)) data = [data];
        const opt = Array.from(el.nativeElement.options);
        opt.forEach((o) => {
          o.selected = data.includes(o.value);
        });
      }
      else {
        if (data === undefined || data === null) return;
        if (Array.isArray(data) && data.length) data = data[0];
        const opt = Array.from(el.nativeElement.options);
        const val = opt.find((o) => o.value == data);
        if (val) val.selected = true;
      }
    }
  }
}
