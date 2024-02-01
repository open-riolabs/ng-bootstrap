import {
  ContentChildren,
  Component,
  Injector,
  Input,
  Optional,
  Self,
  ViewContainerRef,
  ViewChild,
  QueryList,
  DoCheck,
  numberAttribute,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';
import { OptionComponent } from './options.component';

@Component({
  selector: 'rlb-select',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: ` <label *ngIf="label" [for]="id" class="form-label">{{
      label
    }}</label>
    <select
      class="form-select"
      [attr.aria-label]="label"
      [id]="id"
      [attr.disabled]="disabled ? true : undefined"
      [attr.readonly]="readonly ? true : undefined"
      [class.form-select-lg]="size === 'large'"
      [class.form-select-sm]="size === 'small'"
      [attr.placeholder]="placeholder"
      [attr.size]="display"
      [value]="value"
      (blur)="touch()"
      [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
      (change)="update($event.target)"
    >
      <option *ngIf="placeholder" selected disabled>{{ placeholder }}</option>
      <ng-container #projectedDisplayOptions></ng-container>
    </select>
    <div class="invalid-feedback">
      {{ errors | json }}
    </div>`,
})
export class SelectComponent
  extends AbstractComponent<string>
  implements DoCheck, ControlValueAccessor {
  @Input() disabled? = false;
  @Input() label?: string = '';
  @Input() placeholder?: string;
  @Input() size?: 'small' | 'large' | undefined = undefined;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ alias: 'display', transform: numberAttribute }) display?: number = undefined;

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLSelectElement;
      this.setValue(t?.value);
    }
  }

  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;
  @ViewChild('projectedDisplayOptions', { read: ViewContainerRef })
  _projectedDisplayOptions!: ViewContainerRef;

  ngDoCheck() {
    if (this._projectedDisplayOptions && this.options) {
      for (let i = this._projectedDisplayOptions?.length; i > 0; i--) {
        this._projectedDisplayOptions.detach();
      }
      this.options.forEach((option) => {
        this._projectedDisplayOptions?.insert(option._view);
      });
    }
  }
}
