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
import { NgClass } from '@angular/common';
import { InputValidationComponent } from './input-validation.component';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-textarea',
    template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <textarea
        #field
        [id]="id()"
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
        <rlb-input-validation [errors]="errors()" />
      }
    </div>
    <ng-content select="[after]"></ng-content>
  `,
    host: { '[attr.id]': 'null' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass,
        InputValidationComponent,
        DataTableActionComponent,
    ],
})
export class TextAreaComponent extends AbstractComponent<string> {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);
  rows = input(3, { transform: numberAttribute });
  userDefinedId = input('', { alias: 'id' });

  el = viewChild<ElementRef<HTMLTextAreaElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  constructor() {
    super();
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
      const t = ev as HTMLTextAreaElement;
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
