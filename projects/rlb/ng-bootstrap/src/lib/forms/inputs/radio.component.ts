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
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';
import { ControlValueAccessor } from '@angular/forms';
import { OptionComponent } from './options.component';

@Component({
  selector: 'rlb-radio',
  host: {
    class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
  },
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
      <ng-container *ngFor="let option of options; index as i">
        <div class="form-check">
          <input
            #input
            [attr.disabled]="disabled ? true : undefined"
            [attr.readonly]="readonly ? true : undefined"
            class="form-check-input"
            type="radio"
            [name]="id + '-radio'"
            [id]="id + '-radio-' + i"
            [value]="option.value"
            [checked]="value === option.value"
            (blur)="touch()"
            [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
            (change)="update($event.target)"
          />
          <ng-content select="[after]"></ng-content>
        </div>
      </ng-container>
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>`,
})
export class RadioComponent
  extends AbstractComponent<string>
  implements DoCheck, ControlValueAccessor
{
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly?: boolean = false;
  @Input() label?: string = '';

  @ContentChildren(OptionComponent) options!: QueryList<OptionComponent>;
  @ViewChildren('content', { read: ViewContainerRef })
  contents!: QueryList<ViewContainerRef>;

  ngDoCheck() {
    for (const content of this.contents) {
      content?.detach();
    }
    this.options.forEach((option, i) => {
      this.contents.get(i)?.insert(option._view);
    });
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      console.log(t?.value);
      this.setValue(t?.value);
    }
  }
}
