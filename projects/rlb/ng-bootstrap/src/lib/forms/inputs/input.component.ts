import {
	AfterViewInit,
	booleanAttribute,
	Component,
	ElementRef,
	Input,
	numberAttribute,
	OnInit,
	Optional,
	Self,
	TemplateRef,
	ViewChild,
	ViewContainerRef
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
        [type]="_type"
        [name]="name"
        [attr.max]="type === 'number' && max !== null && max !== undefined ? max : undefined"
        [attr.min]="type === 'number' && min !== null && min !== undefined ? min : undefined"
        [attr.step]="type === 'number' && step !== null && step !== undefined ? step : undefined"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        [value]="value || ''"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      />
      <rlb-input-validation *ngIf="!extValidation" [errors]="errors"/>
    <ng-content select="[after]"></ng-content>
  </ng-template>`,
  standalone: false
})
export class InputComponent
  extends AbstractComponent<any>
  implements OnInit, AfterViewInit {
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled?: boolean;
  @Input({ alias: 'readonly', transform: booleanAttribute, }) readonly?: boolean;
  @Input({ alias: 'before-text', transform: booleanAttribute, }) beforeText?: boolean;
  @Input({ alias: 'placeholder' }) placeholder?: string;
  @Input({ alias: 'type' }) type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string = 'text';
  @Input({ alias: 'size' }) size?: 'small' | 'large';
  @Input({ alias: 'name' }) name?: string;
  @Input({ alias: 'max', transform: numberAttribute }) max?: number;
  @Input({ alias: 'min', transform: numberAttribute }) min?: number;
  @Input({ alias: 'step', transform: numberAttribute }) step?: number;
  @Input({ alias: 'date-type' }) dateType?: 'date' | 'string' | 'number' | 'date-tz' = 'string';
  @Input({ alias: 'timezone' }) timezone?: string = 'UTC';
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';
	@Input({ alias: 'extValidation', transform: booleanAttribute, }) extValidation: boolean = false;

  get _type(): string {
    if (this.type === 'number') return 'text';
    return this.type || 'text';
  }

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

  constructor(private viewContainerRef: ViewContainerRef, idService: UniqueIdService, @Self() @Optional() override control?: NgControl) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      if (this.type === 'number') {
        const t = ev as HTMLInputElement;
        const val = this.removeNonDigits(t?.value);
        if (!val) t.value = '';
        const comma = val.includes('.');
        let v = parseFloat(val);
        if (!isNaN(v)) {
          if (this.max && v > this.max) {
            v = this.max;
          }
          if (this.min && v < this.min) {
            v = this.min;
          }
          let text = v.toString() + (comma ? '.' : '');
          const firstDotIndex = text.indexOf('.');
          if (firstDotIndex !== -1) {
            text = (text.match(/\./g) || [])?.length > 1 ? text.slice(0, firstDotIndex + 1) + text.slice(firstDotIndex + 1).replace(/\./g, '') : text;
          }
          this.onChanged?.(parseFloat(text));
          t.value = text;
          return;
        }
      } if (this.type === 'datetime-local') {
        if (this.dateType === 'string') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(t?.value || '');
        } else if (this.dateType === 'number') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(Date.parse(t?.value + ':00'));
        } else if (this.dateType === 'date') {
          const t = ev as HTMLInputElement;
          this.onChanged?.(new Date(Date.parse(t?.value + ':00')));
        } else if (this.dateType === 'date-tz') {
          const t = ev as HTMLInputElement;
          const d = DateTz.parse(t?.value, 'YYYY-MM-DDTHH:mm', this.timezone);
          this.onChanged?.(d);
        }
      }
      else {
        const t = ev as HTMLInputElement;
        this.setValue(t?.value || '');
      }
    }
  }

  override onWrite(data: string): void {
    if (this.el && this.el.nativeElement) {
      if (this.type === 'number') {
				if (data === '' || data === null || data === undefined) {
					this.value = '';
					this.el.nativeElement.value = '';
					return;
				}
				
				let val = parseFloat(this.removeNonDigits(data));
				
				if (this.max && val > this.max) {
          val = this.max;
        }
        if (this.min && val < this.min) {
          val = this.min;
        }
        this.value = data;
        this.el.nativeElement.value = val.toString();
        return;
      } if (this.type === 'datetime-local') {
        if (this.dateType === 'string') {
          this.value = data;
          this.el.nativeElement.value = data || '';
        } else if (this.dateType === 'date') {
          const d: Date = data as any;
          this.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          this.el.nativeElement.value = this.value;
        } else if (this.dateType === 'number') {
          const d: Date = new Date(data);
          this.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          this.el.nativeElement.value = this.value;
        } else if (this.dateType === 'date-tz') {
          let d: IDateTz = data as any;
          if (!d?.timestamp) return;
          if (!d?.timezone) d.timezone = this.timezone;
          d = new DateTz(d);
          this.value = `${d.toString?.("YYYY-MM-DDTHH:mm")}`;
          this.el.nativeElement.value = this.value;
        }
      }
      else {
        this.value = data;
        this.el.nativeElement.value = data || '';
      }
    }
  }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    //this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterViewInit() {
    this.onWrite(this.value || '');
  }

  removeNonDigits(value: string): string {
    const filtered = value.toString().match(/[0-9,.]/g)?.join('') || '';
    const standardized = filtered.replace(/,/g, '.');
    const [integerPart, ...fractionalParts] = standardized.split('.');
    const result = fractionalParts.length > 0 ? `${integerPart}.${fractionalParts.join('')}` : integerPart;
    return result;
  }

}
