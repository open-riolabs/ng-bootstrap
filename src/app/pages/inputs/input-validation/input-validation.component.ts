import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class InputValidationsComponent {
  /** Reactive form controls used in the live examples. */
  requiredControl = new FormControl('', [Validators.required]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  minLengthControl = new FormControl('', [Validators.minLength(5)]);

  // ── Code strings shown in <docs-example [code]="..."> ──────────────────

  basicExample = `<rlb-input
  name="username"
  [formControl]="requiredControl"
  enable-validation
  placeholder="Username">
</rlb-input>`;

  multipleValidatorsExample = `<rlb-input
  name="email"
  [formControl]="emailControl"
  enable-validation
  placeholder="Email address">
</rlb-input>`;

  minLengthExample = `<rlb-input
  name="password"
  [formControl]="minLengthControl"
  enable-validation
  placeholder="Min 5 characters">
</rlb-input>`;

  standaloneExample = `<!-- Standalone usage: pass ValidationErrors directly -->
<rlb-input-validation [errors]="{ required: true }" />`;

  helpTextExample = `<rlb-input
  name="search"
  helpText="Enter at least 3 characters to search."
  placeholder="Search...">
</rlb-input>`;

  // ── API rows ────────────────────────────────────────────────────────────

  validationApi: DocApiRow[] = [
    {
      name: 'errors',
      type: 'ValidationErrors',
      default: '{}',
      description:
        'Two-way binding for Angular ValidationErrors. Each key is resolved through the optional RLB_TRANSLATION_SERVICE; without a translation service the component falls back to the raw i18n key plus the JSON-serialised error value.',
      kind: 'Two-way',
    },
  ];

  helpTextApi: DocApiRow[] = [
    {
      name: 'helpText',
      type: 'string',
      default: "''",
      description:
        'Appends a Bootstrap form-text <div> directly after the native input element and wires aria-labelledby so screen readers associate the hint with the field.',
      kind: 'Input',
    },
  ];
}
