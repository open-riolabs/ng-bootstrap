import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  ViewContainerRef,
  ViewChildren,
  ElementRef,
  DoCheck,
  booleanAttribute,
  ViewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';
import { ControlValueAccessor } from '@angular/forms';
import { OptionComponent } from './options.component';

@Component({
    selector: 'rlb-radio',
    template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
      @for (option of options; track option; let i = $index) {
        <div class="form-check">
          <input
            #field
            [attr.disabled]="disabled ? true : undefined"
            [attr.readonly]="readonly ? true : undefined"
            class="form-check-input {{option.cssValue}}"
            type="radio"
            [name]="id + '-radio'"
            [id]="id + '-radio-' + i"
            [value]="option.value"
            [checked]="value === option.value"
            (blur)="touch()"
            [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
            (change)="update($event.target)"
            />
            <span #content></span>
          </div>
        }
        <ng-content select="[after]"></ng-content>
        <div class="invalid-feedback">
          {{ errors | json }}
        </div>
      </div>`,
    standalone: false
})
export class RadioComponent
  extends AbstractComponent<string>
  implements DoCheck, ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';
  
  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;
  @ViewChildren('content', { read: ViewContainerRef }) contents!: QueryList<ViewContainerRef>;
  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

  ngDoCheck() {
    for (const content of (this.contents || [])) {
      content?.detach();
    }
    this.options?.forEach((option, i) => {
      this.contents.get(i)?.insert(option._view);
    });
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value);
    }
  }

  override onWrite(data: string): void {
    if (this.el && this.el.nativeElement) {
      this.el.nativeElement.value = data;
    }
  }
}
