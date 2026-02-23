import {
  booleanAttribute,
  Component,
  contentChildren,
  effect,
  ElementRef,
  input,
  InputSignal,
  Optional,
  Self,
  viewChild,
  viewChildren,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { OptionComponent } from './options.component';

@Component({
  selector: 'rlb-radio',
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>

      @for (option of options(); track option; let i = $index) {
        <div class="form-check">
          <input
            #field
            [attr.disabled]="disabled() ? true : undefined"
            [attr.readonly]="readonly() ? true : undefined"
            class="form-check-input"
            type="radio"
            [name]="id + '-radio'"
            [id]="id + '-radio-' + i"
            [value]="option.value()"
            [checked]="value === option.value()"
            (blur)="touch()"
            [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
            (change)="update($event.target)"
          />
          <!-- We use this span as an anchor to insert the Option text -->
          <label
            class="form-check-label"
            [for]="id + '-radio-' + i"
          >
            <span #content></span>
          </label>
        </div>
      }

      <ng-content select="[after]"></ng-content>
      <div class="invalid-feedback">
        {{ errors() | json }}
      </div>
    </div>
  `,
  standalone: false,
})
export class RadioComponent extends AbstractComponent<string> implements ControlValueAccessor {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });

  options = contentChildren(OptionComponent);
  contents = viewChildren('content', { read: ViewContainerRef });
  el = viewChild<ElementRef<HTMLInputElement>>('field');

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);

    effect(() => {
      const options = this.options();
      const contents = this.contents();

      if (options.length > 0 && contents.length === options.length) {
        contents.forEach((vcr, i) => {
          vcr.clear(); // Clear previous view

          const option = options[i];
          if (option) {
            vcr.createEmbeddedView(option.contentTemplate());
          }
        });
      }
    });
  }

  update(ev: EventTarget | null) {
    if (!this.disabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.value);
    }
  }

  override onWrite(data: string): void {
    const el = this.el();
    if (el && el.nativeElement) {
      el.nativeElement.value = data;
    }
  }
}
