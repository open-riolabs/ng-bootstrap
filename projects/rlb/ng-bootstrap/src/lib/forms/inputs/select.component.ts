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
  ElementRef,
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
  template: `
  <div class="input-group has-validation">
    <ng-content select="[before]"></ng-content>
    <select
      #select
      class="form-select"
      [id]="id"
      [attr.disabled]="disabled ? true : undefined"
      [attr.readonly]="readonly ? true : undefined"
      [attr.multiple]="multiple ? true : undefined"
      [class.form-select-lg]="size === 'large'"
      [class.form-select-sm]="size === 'small'"
      [attr.placeholder]="placeholder"
      [attr.size]="display"
      (blur)="touch()"
      [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
      (change)="update($event.target)"
    >
      <option *ngIf="placeholder" selected disabled>{{ placeholder }}</option>
      <ng-container #projectedDisplayOptions></ng-container>
    </select>
    <ng-content select="[after]"></ng-content>
    <div class="invalid-feedback">
      {{ errors | json }}
    </div>
  </div>`,
})
export class SelectComponent
  extends AbstractComponent<string | string[]>
  implements DoCheck, ControlValueAccessor {
  @Input() placeholder?: string;
  @Input() size?: 'small' | 'large' | undefined = undefined;
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ alias: 'multiple', transform: booleanAttribute }) multiple?: boolean = false;
  @Input({ alias: 'display', transform: numberAttribute }) display?: number = undefined;
  @ViewChild('select') el!: ElementRef<HTMLSelectElement>;

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLSelectElement;
      if (this.multiple) {
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
    if (this.el && this.el.nativeElement) {
      if (this.multiple) {
        if (!Array.isArray(data)) data = [data];
        const opt = Array.from(this.el.nativeElement.options);
        opt.forEach((o) => {
          o.selected = data.includes(o.value);
        });
      }
      else {
        console.log(data);
        if (data === undefined || data === null) return;
        if (Array.isArray(data) && data.length) data = data[0];
        const opt = Array.from(this.el.nativeElement.options);
        const val = opt.find((o) => o.value === data);
        this.el.nativeElement.value = data as string;
        if (val) val.selected = true;
      }
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
