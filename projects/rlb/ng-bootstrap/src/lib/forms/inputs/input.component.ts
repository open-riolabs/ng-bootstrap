import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-input',
  template: `
  <ng-template #template>
    <ng-content select="[before]"></ng-content>
      <input
        #field
        [id]="id"
        class="form-control"
        [type]="type"
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
        (keydown)="keyup($event)"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
        (paste)="paste($event)"
      />
      <rlb-input-validation *ngIf="!extValidation" [errors]="errors"/>
    <ng-content select="[after]"></ng-content>
  </ng-template>`,
})
export class InputComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
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
  @Input({ alias: 'cd-en', transform: booleanAttribute }) commaDotEnabled?: boolean

  public extValidation: boolean = false;

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      if (this.type === 'number') {
        const t = ev as HTMLInputElement;
        let v = parseFloat(t?.value || '');
        if (this.max && v > this.max) {
          v = this.max;
        }
        if (this.min && v < this.min) {
          v = this.min;
        }
        this.setValue(v.toString());
        return;
      }
      const t = ev as HTMLInputElement;
      this.setValue(t?.value || '');
    }
  }

  override onWrite(data: string): void {
    if (this.el && this.el.nativeElement) {
      if (this.type === 'number') {
        let val = parseFloat(data);
        if (this.max && val > this.max) {
          val = this.max;
        }
        if (this.min && val < this.min) {
          val = this.min;
        }
        this.el.nativeElement.value = val.toString();
        return
      }
      this.el.nativeElement.value = data || '';
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

  decimal: boolean = false
  keyup(ev: KeyboardEvent) {
    if (this.commaDotEnabled && this.type === 'number') {
      const target = ev.target as HTMLInputElement
      const val = target.value
      if (ev.key === ',' || ev.key === '.') {
        const sep = this.getNumberSeparator()
        if (ev.key === sep) {
          return;
        }
        if (!(val.includes(',') && val.includes(','))) {
          this.decimal = true
          return
        }
      }
      if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(ev.key)) {
        if (this.decimal) {
          setTimeout(() => {
            let f = parseFloat(`${val}${this.getNumberSeparator()}${ev.key}`) as any
            this.decimal = false
            if (this.max !== undefined && f > this.max) {
              f = this.max
            }
            if (this.min !== undefined && f < this.min) {
              f = this.min
            }
            target.value = f as any
          }, 1)
          return
        } else {
          setTimeout(() => {
            let f = parseFloat(`${val}${ev.key}`)
            if (this.max !== undefined && f > this.max) {
              f = this.max
            }
            if (this.min !== undefined && f < this.min) {
              f = this.min
            }
            target.value = f as any
          }, 1)
        }
      }
    }
  }

  paste(event: ClipboardEvent) {
    if (this.commaDotEnabled && this.type === 'number') {
      event.stopPropagation();
      event.preventDefault();
      let clipboardData = event.clipboardData
      let pastedData = clipboardData?.getData('Text');
      pastedData = pastedData?.replaceAll(/\.|,/g, this.getNumberSeparator())
      const num = parseFloat(pastedData || '')
      if (!isNaN(num)) {
        const t = event.target as HTMLInputElement
        t.value = num as any
      }
    }
  }

  private getNumberSeparator() {
    return (1.1).toLocaleString().substring(1, 2);
  }
}
