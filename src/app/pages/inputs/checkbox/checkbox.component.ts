import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class CheckboxsComponent {
  basicControl = new FormControl(false);

  requiredControl = new FormControl(false, Validators.requiredTrue);
  requiredForm = new FormGroup({ accepted: this.requiredControl });

  indeterminateControl = new FormControl<boolean | undefined>(undefined);

  basicExample = `<rlb-checkbox [formControl]="basicControl"></rlb-checkbox>`;

  labelExample = `<rlb-checkbox [formControl]="basicControl">
  <label class="form-check-label" after>Accept terms and conditions</label>
</rlb-checkbox>`;

  disabledExample = `<rlb-checkbox [disabled]="true" [formControl]="basicControl">
  <label class="form-check-label" after>Disabled checkbox</label>
</rlb-checkbox>`;

  readonlyExample = `<rlb-checkbox [readonly]="true" [formControl]="basicControl">
  <label class="form-check-label" after>Read-only checkbox</label>
</rlb-checkbox>`;

  indeterminateExample = `<rlb-checkbox [indeterminate]="true" [formControl]="indeterminateControl">
  <label class="form-check-label" after>Indeterminate checkbox (value is undefined)</label>
</rlb-checkbox>`;

  validationExample = `<form [formGroup]="requiredForm">
  <rlb-checkbox formControlName="accepted" enable-validation>
    <label class="form-check-label" after>I agree to the terms</label>
  </rlb-checkbox>
</form>`;

  api: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom id for the underlying input element. If not provided, a unique id is auto-generated.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the checkbox, preventing user interaction. Also honours the Angular CVA disabled state.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the checkbox read-only: it renders as enabled but user interaction has no effect.',
      kind: 'Input',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Enables the indeterminate visual state when the bound value is undefined or null.',
      kind: 'Input',
    },
    {
      name: 'enable-validation',
      type: 'boolean',
      default: 'false',
      description: 'When true, applies Bootstrap is-valid / is-invalid classes based on the bound FormControl state after the field is touched or dirty.',
      kind: 'Input',
    },
    {
      name: 'extValidation',
      type: 'boolean',
      default: 'false',
      description: 'Suppresses the built-in inline validation message when true, delegating error display to an external component.',
      kind: 'Input',
    },
    {
      name: 'setExtValidation',
      type: '(val: boolean) => void',
      description: 'Programmatically toggle external-validation mode, equivalent to binding [extValidation].',
      kind: 'Method',
    },
  ];
}
