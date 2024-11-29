import { Component, Input } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Component({
    selector: 'rlb-input-validation',
    host: { class: 'invalid-feedback' },
    template: `<span>{{ errors | json }}</span>`,
    standalone: false
})
export class InputValidationComponent {
  @Input({ alias: 'errors' }) public errors!: ValidationErrors;
}
