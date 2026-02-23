import {
  booleanAttribute,
  Component,
  ElementRef,
  input,
  Optional,
  Self,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

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
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.multiple]="multiple() ? true : undefined"
        [attr.accept]="accept() ? accept() : undefined"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (change)="onFileChange($event)"
      />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <ng-content select="[after]"></ng-content>
  `,
  standalone: false,
})
export class FileComponent
  extends AbstractComponent<File | File[] | null>
  implements ControlValueAccessor
{
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  multiple = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);
  accept = input<string | undefined>(undefined);
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });

  el = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  onFileChange(ev: Event) {
    if (!this.disabled()) {
      const input = ev.target as HTMLInputElement;
      if (!input.files) {
        this.setValue(null);
        return;
      }
      this.setValue(this.multiple() ? Array.from(input.files) : input.files[0]);
    }
  }

  override onWrite(data: File | File[] | null): void {
    const el = this.el();
    if (el && el.nativeElement) {
      el.nativeElement.value = '';
    }
  }
}
