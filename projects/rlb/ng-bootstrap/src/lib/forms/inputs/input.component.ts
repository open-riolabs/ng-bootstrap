import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DateTz } from '@open-rlb/date-tz';
import { AbstractComponent } from './abstract-field.component';
import { NgClass } from '@angular/common';
import { InputValidationComponent } from './input-validation.component';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-input',
    template: `
    <ng-template #template>
      <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id()"
        class="form-control"
        [type]="_type()"
        [attr.name]="name() || null"
        [attr.max]="type() === 'number' && max() != null ? max() : null"
        [attr.min]="type() === 'number' && min() != null ? min() : null"
        [attr.step]="type() === 'number' && step() != null ? step() : null"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        [placeholder]="placeholder() || ''"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        (blur)="touch()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (input)="update($event.target)"
      />
      @if (!_extValidation() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }
      <ng-content select="[after]"></ng-content>
    </ng-template>
  `,
    host: { '[attr.id]': 'null' },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass,
        InputValidationComponent,
        DataTableActionComponent,
    ],
})
export class InputComponent extends AbstractComponent<any> implements OnInit, AfterViewInit {
  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  type = input<string>('text');
  size = input<'small' | 'large' | undefined>(undefined);
  name = input<string | undefined>(undefined);
  max = input(undefined, { transform: numberAttribute });
  min = input(undefined, { transform: numberAttribute });
  step = input(undefined, { transform: numberAttribute });
  dateType = input<'date' | 'string' | 'number' | 'date-tz' | string | undefined>('date-tz', {
    alias: 'date-type',
  });
  timezone = input('UTC');
  userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });
  extValidation = input(false, { transform: booleanAttribute });
  enableValidation = input(false, {
    alias: 'enable-validation',
    transform: booleanAttribute,
  });

  protected _forceExtValidation = signal(false);
  protected _extValidation = computed(() => this.extValidation() || this._forceExtValidation());

  setExtValidation(val: boolean) {
    this._forceExtValidation.set(val);
  }

  protected _type = computed(() => (this.type() === 'number' ? 'text' : this.type() || 'text'));
  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  template = viewChild.required<TemplateRef<any>>('template');
  private viewContainerRef = inject(ViewContainerRef);

  // Directly hold reference to the native input extracted from the embedded view
  private nativeInputEl: HTMLInputElement | null = null;

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    const view = this.viewContainerRef.createEmbeddedView(this.template());
    const inputNode = view.rootNodes.find(n => n.tagName === 'INPUT' || n.nodeName === 'INPUT');
    if (inputNode) {
      this.nativeInputEl = inputNode as HTMLInputElement;
    }
    this.viewContainerRef.element.nativeElement.remove();
  }

  update(ev: EventTarget | null) {
    if (this.isDisabled() || !ev) return;
    const t = ev as HTMLInputElement;

    if (this.type() === 'number') {
      const val = this.removeNonDigits(t.value);
      if (!val) {
        t.value = '';
        this.setValue('');
        return;
      }
      const comma = val.includes('.');
      let v = parseFloat(val);
      if (!isNaN(v)) {
        if (this.max() != null && v > this.max()!) v = this.max()!;
        if (this.min() != null && v < this.min()!) v = this.min()!;

        let text = v.toString() + (comma ? '.' : '');
        const firstDotIndex = text.indexOf('.');
        if (firstDotIndex !== -1) {
          text =
            (text.match(/\./g) || [])?.length > 1
              ? text.slice(0, firstDotIndex + 1) + text.slice(firstDotIndex + 1).replace(/\./g, '')
              : text;
        }
        t.value = text;
        this.setValue(parseFloat(text));
      }
    } else if (this.type() === 'datetime-local') {
      if (this.dateType() === 'string') {
        this.setValue(t.value || '');
      } else if (this.dateType() === 'number') {
        this.setValue(Date.parse(t.value + ':00'));
      } else if (this.dateType() === 'date') {
        this.setValue(new Date(Date.parse(t.value + ':00')));
      } else if (this.dateType() === 'date-tz') {
        const d = DateTz.parse(t.value, 'YYYY-MM-DDTHH:mm', this.timezone());
        this.setValue(d);
      }
    } else {
      this.setValue(t.value);
    }
  }

  override onWrite(data: any): void {
    if (!this.nativeInputEl) return;

    const nativeEl = this.nativeInputEl;

    if (data == null || data === '') {
      nativeEl.value = '';
      return;
    }

    if (this.type() === 'number') {
      let val = parseFloat(this.removeNonDigits(String(data)));
      if (isNaN(val)) {
        nativeEl.value = '';
        return;
      }
      if (this.max() != null && val > this.max()!) val = this.max()!;
      if (this.min() != null && val < this.min()!) val = this.min()!;
      nativeEl.value = val.toString();
    } else if (this.type() === 'datetime-local') {
      if (this.dateType() === 'string') {
        nativeEl.value = data || '';
      } else if (this.dateType() === 'date') {
        const d: Date = data as any;
        if (d && !isNaN(d.getTime())) {
          nativeEl.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        } else {
          nativeEl.value = '';
        }
      } else if (this.dateType() === 'number') {
        const d: Date = new Date(data as any);
        if (d && !isNaN(d.getTime())) {
          nativeEl.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        } else {
          nativeEl.value = '';
        }
      } else if (this.dateType() === 'date-tz') {
        let d: any = data;
        if (!d?.timestamp) return;
        if (!d?.timezone) d.timezone = this.timezone();
        d = new DateTz(d);
        nativeEl.value = `${d.toString?.('YYYY-MM-DDTHH:mm')}` || '';
      }
    } else {
      // Safely assign text value
      nativeEl.value = data !== undefined ? String(data) : '';
    }
  }

  ngAfterViewInit() {
    this.onWrite(this.value());
  }

  removeNonDigits(value: string): string {
    if (!value) return '';
    const filtered =
      value
        .toString()
        .match(/[0-9,.-]/g)
        ?.join('') || '';
    const standardized = filtered.replace(/,/g, '.');
    const [integerPart, ...fractionalParts] = standardized.split('.');
    return fractionalParts.length > 0 ? `${integerPart}.${fractionalParts.join('')}` : integerPart;
  }
}
