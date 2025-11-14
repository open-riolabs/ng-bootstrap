import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList
} from '@angular/core';
import { InputComponent } from './input.component';
import { ValidationErrors } from '@angular/forms';
import { InputValidationComponent } from './input-validation.component';

@Component({
    selector: 'rlb-input-group',
    host: {
        '[class.has-validation]': 'validate',
        '[class.input-group]': '!text',
        '[class.input-group-text]': 'text',
        '[class.input-group-sm]': 'size === "small"',
        '[class.input-group-lg]': 'size === "large"',
    },
    template: `<ng-content></ng-content>`,
    standalone: false
})
export class InputGroupComponent implements AfterContentInit {

  @Input({ alias: 'text', transform: booleanAttribute }) text?: boolean
  @Input({ alias: 'validate', transform: booleanAttribute }) validate?: boolean = false
  @Input({ alias: 'size' }) size?: 'small' | 'large'

  validations: ValidationErrors = {};

  @ContentChildren(InputComponent) inputs!: QueryList<InputComponent>;
  @ContentChild(InputValidationComponent) validation!: InputValidationComponent;
  ngAfterContentInit(): void {
    if (this.validate) {
      for (const input of this.inputs.toArray()) {
        input.extValidation = true;
        if (input.errors && input.name) {
          this.validations[input.name] = input.errors;
        }
      }
      if (this.validation) {
        this.validation.errors = this.validations;
      }
    }
  }
}
