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
    selector: 'rlb-file',
    host: {
        class: 'd-flex flex-grow-1 flex-shrink-1 flex-auto',
    },
    template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        type="file"
        class="form-control"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.multiple]="multiple ? true : undefined"
        [attr.accept]="accept ? accept : undefined"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (change)="update($event.target)"
        [value]="value" />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>`,
    standalone: false
})
export class FileComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor {
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled? = false;
  @Input({ alias: 'readonly', transform: booleanAttribute }) readonly? = false;
  @Input({ alias: 'multiple', transform: booleanAttribute, }) multiple?: boolean;
  @Input({ alias: 'size' }) size?: 'small' | 'large';
  @Input({ alias: 'accept' }) accept?: string | undefined;

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

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
