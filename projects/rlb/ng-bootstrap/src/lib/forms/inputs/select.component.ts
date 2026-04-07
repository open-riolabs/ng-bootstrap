import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  numberAttribute,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
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
        [id]="id()"
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
          <option
            selected
            disabled
          >
            {{ placeholder() }}
          </option>
        }
        <ng-container #projectedDisplayOptions></ng-container>
      </select>
      @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }
    </div>
    <ng-content select="[after]"></ng-content>
  `,
  host: { '[attr.id]': 'null' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent extends AbstractComponent<string | string[]> {
  placeholder = input<string | undefined>(undefined, { alias: 'placeholder' });
  size = input<'small' | 'large' | undefined>(undefined, { alias: 'size' });
  disabled = input(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly = input(false, { alias: 'readonly', transform: booleanAttribute });
  multiple = input(false, { alias: 'multiple', transform: booleanAttribute });
  display = input<number, unknown>(undefined, { alias: 'display', transform: numberAttribute });
  userDefinedId = input('', {
    alias: 'inputId',
    transform: (v: string | undefined) => v || '',
  });
  enableValidation = input(false, { transform: booleanAttribute, alias: 'enable-validation' });

  el = viewChild<ElementRef<HTMLSelectElement>>('select');
  _projectedDisplayOptions = viewChild('projectedDisplayOptions', {
    read: ViewContainerRef,
  });
  options = contentChildren(OptionComponent);

  constructor() {
    super();

    afterNextRender(() => {
      // This executes exactly when the DOM is fully painted and bindings are settled
      this.onWrite(this.value());
    });

    effect(() => {
      const vcr = this._projectedDisplayOptions(); // The ViewContainerRef in the Select
      const options = this.options(); // The list of OptionComponents

      if (!vcr) return;

      vcr.clear();

      options.forEach(opt => {
        vcr.createEmbeddedView(opt.template());
      });

      untracked(() => {
        this.onWrite(this.value());
      });
    });
  }

  update(ev: EventTarget | null) {
    if (!this.disabled()) {
      const t = ev as HTMLSelectElement;
      if (this.multiple()) {
        const selected = Array.from(t.selectedOptions)
          .filter(o => o.selected)
          .map(o => o.value);
        this.setValue(selected);
      } else {
        this.setValue(t?.value);
      }
    }
  }

  override onWrite(data: string | string[] | undefined): void {
    const el = this.el?.();
    if (el && el.nativeElement) {
      if (data === undefined || data === null) return;

      const normalizedData = Array.isArray(data) ? data : [data];

      if (this.multiple()) {
        const opt = Array.from(el.nativeElement.options);
        opt.forEach(o => {
          o.selected = normalizedData.includes(o.value);
        });
      } else {
        const singleData = normalizedData.length > 0 ? normalizedData[0] : undefined;
        if (singleData === undefined) return;

        const opt = Array.from(el.nativeElement.options);
        const val = opt.find(o => o.value == singleData);
        if (val) val.selected = true;
      }
    }
  }
}
