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
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';
import { OptionComponent } from './options.component';

@Component({
  selector: 'rlb-select',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
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
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>`,
})
export class SelectComponent
  extends AbstractComponent<string | string[]>
  implements DoCheck, ControlValueAccessor, AfterContentChecked {
  @Input({ alias: 'placeholder' }) placeholder?: string;
  @Input({ alias: 'size' }) size?: 'small' | 'large';
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean;
  @Input({ alias: 'multiple', transform: booleanAttribute }) multiple?: boolean;
  @Input({ alias: 'display', transform: numberAttribute }) display?: number;

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

  ngAfterContentChecked(): void {
    this.onWrite(this.value);
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
        if (data === undefined || data === null) return;
        if (Array.isArray(data) && data.length) data = data[0];
        const opt = Array.from(this.el.nativeElement.options);
        const val = opt.find((o) => o.value === data);
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
