import {
  booleanAttribute,
  Component,
  contentChild,
  contentChildren,
  effect,
  input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { InputValidationComponent } from './input-validation.component';
import { InputComponent } from './input.component';

@Component({
  selector: 'rlb-input-group',
  host: {
    '[class.has-validation]': 'validate()',
    '[class.input-group]': '!text()',
    '[class.input-group-text]': 'text()',
    '[class.input-group-sm]': 'size() === "small"',
    '[class.input-group-lg]': 'size() === "large"',
  },
  template: `<ng-content></ng-content>`,
  standalone: false
})
export class InputGroupComponent {

  text = input(false, { alias: 'text', transform: booleanAttribute });
  validate = input(false, { alias: 'validate', transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);

  validations: ValidationErrors = {};

  inputs = contentChildren(InputComponent);
  validation = contentChild(InputValidationComponent);

  constructor() {
    effect(() => {
      if (this.validate()) {
        const inputs = this.inputs();
        const validation = this.validation();

        const aggregatedErrors: ValidationErrors = {};
        for (const input of inputs) {
          input.setExtValidation(true);
          const name = input.name();
          const errors = input.errors();
          if (errors && Object.keys(errors).length > 0 && name) {
            aggregatedErrors[name] = errors;
          }
        }
        this.validations = aggregatedErrors;

        if (validation) {
          validation.errors.set(this.validations);
        }
      }
    });
  }
}
