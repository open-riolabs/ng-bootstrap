import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  numberAttribute,
  OnInit,
  Optional,
  Self,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-input',
  template: `
    <ng-template #template>
      <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id"
        class="form-control"
        [type]="_type()"
        [name]="name()"
        [attr.max]="
          type() === 'number' && max() !== null && max() !== undefined ? max() : undefined
        "
        [attr.min]="
          type() === 'number' && min() !== null && min() !== undefined ? min() : undefined
        "
        [attr.step]="
          type() === 'number' && step() !== null && step() !== undefined ? step() : undefined
        "
        [attr.disabled]="isDisabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [value]="value || ''"
        (blur)="touch()"
        [ngClass]="{
          'is-invalid': control?.touched && control?.invalid && enableValidation(),
          'is-valid': control?.touched && control?.valid && enableValidation(),
        }"
        (input)="update($event.target)"
      />
      @if (!_extValidation() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }
      <ng-content select="[after]"></ng-content>
    </ng-template>
  `,
  standalone: false,
})
export class InputComponent extends AbstractComponent<any> implements OnInit, AfterViewInit {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  beforeText = input(false, {
    alias: 'before-text',
    transform: booleanAttribute,
  });
  placeholder = input<string | undefined>(undefined);
  type = input<string>('text');
  size = input<'small' | 'large' | undefined>(undefined);
  name = input<string | undefined>(undefined);
  max = input(undefined, { transform: numberAttribute });
  min = input(undefined, { transform: numberAttribute });
  step = input(undefined, { transform: numberAttribute });
  dateType = input<'date' | 'string' | 'number' | 'date-tz' | string | undefined>(undefined, {
    alias: 'date-type',
  });
  timezone = input('UTC');
  userDefinedId = input('', { alias: 'id' });
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

  protected _type = computed(() => {
    if (this.type() === 'number') return 'text';
    return this.type() || 'text';
  });

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  template = viewChild.required<TemplateRef<any>>('template');

  constructor(
    private viewContainerRef: ViewContainerRef,
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
      if (this.type() === 'number') {
        const t = ev as HTMLInputElement;
        const val = this.removeNonDigits(t?.value);
        if (!val) t.value = '';
        const comma = val.includes('.');
        let v = parseFloat(val);
        if (!isNaN(v)) {
          if (this.max() !== undefined && v > this.max()!) {
            v = this.max()!;
          }
          if (this.min() !== undefined && v < this.min()!) {
            v = this.min()!;
          }
          let text = v.toString() + (comma ? '.' : '');
          const firstDotIndex = text.indexOf('.');
          if (firstDotIndex !== -1) {
            text =
              (text.match(/\./g) || [])?.length > 1
                ? text.slice(0, firstDotIndex + 1) +
                  text.slice(firstDotIndex + 1).replace(/\./g, '')
                : text;
          }
          this.onChanged?.(parseFloat(text));
          t.value = text;
          return;
        }
      }
      if (this.type() === 'datetime-local') {
        if (this.dateType() === 'string') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(t?.value || '');
        } else if (this.dateType() === 'number') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(Date.parse(t?.value + ':00'));
        } else if (this.dateType() === 'date') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(new Date(Date.parse(t?.value + ':00')));
        } else if (this.dateType() === 'date-tz') {
          const t = ev as HTMLInputElement;
          const d = DateTz.parse(t?.value, 'YYYY-MM-DDTHH:mm', this.timezone());
          this.onChanged?.(d);
        }
      } else {
        const t = ev as HTMLInputElement;
        this.setValue(t?.value || '');
      }
    }
  }

  override onWrite(data: string): void {
    const el = this.el();

    // If the view isn't ready yet, just store the value and exit.
    // ngAfterViewInit will call this method again once el() is available.
    if (!el || !el.nativeElement) {
      this.value = data;
      return;
    }

    if (el && el.nativeElement) {
      if (this.type() === 'number') {
        if (data === '' || data === null || data === undefined) {
          this.value = '';
          el.nativeElement.value = '';
          return;
        }

        let val = parseFloat(this.removeNonDigits(data));

        if (this.max() !== undefined && val > this.max()!) {
          val = this.max()!;
        }
        if (this.min() !== undefined && val < this.min()!) {
          val = this.min()!;
        }
        this.value = data;
        el.nativeElement.value = val.toString();
        return;
      }
      if (this.type() === 'datetime-local') {
        if (this.dateType() === 'string') {
          this.value = data;
          el.nativeElement.value = data || '';
        } else if (this.dateType() === 'date') {
          const d: Date = data as any;
          this.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          el.nativeElement.value = this.value;
        } else if (this.dateType() === 'number') {
          const d: Date = new Date(data);
          this.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          el.nativeElement.value = this.value;
        } else if (this.dateType() === 'date-tz') {
          let d: IDateTz = data as any;
          if (!d?.timestamp) return;
          if (!d?.timezone) d.timezone = this.timezone();
          d = new DateTz(d);
          this.value = `${d.toString?.('YYYY-MM-DDTHH:mm')}`;
          el.nativeElement.value = this.value;
        }
      } else {
        this.value = data;
        el.nativeElement.value = data || '';
      }
    }
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    //this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterViewInit() {
    this.onWrite(this.value || '');
  }

  removeNonDigits(value: string): string {
    const filtered =
      value
        .toString()
        .match(/[0-9,.]/g)
        ?.join('') || '';
    const standardized = filtered.replace(/,/g, '.');
    const [integerPart, ...fractionalParts] = standardized.split('.');
    const result =
      fractionalParts.length > 0 ? `${integerPart}.${fractionalParts.join('')}` : integerPart;
    return result;
  }
}
