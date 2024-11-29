import {
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
    selector: 'rlb-textarea',
    template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <textarea
        #field
        [id]="id"
        class="form-control"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-select-lg]="size === 'large'"
        [class.form-select-sm]="size === 'small'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
      ></textarea>
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>`,
    standalone: false
})
export class TextAreaComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input({ alias: 'placeholder' }) placeholder?: string;
  @Input({ alias: 'size' }) size?: 'small' | 'large';

  @ViewChild('field', { read: ElementRef }) el!: ElementRef<HTMLTextAreaElement>;

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
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
