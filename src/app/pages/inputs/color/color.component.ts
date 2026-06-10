import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ColorsComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      favoriteColor: ['#4f46e5', Validators.required],
    });
  }

  basicExample = `<rlb-color></rlb-color>`;

  reactiveExample = `<form [formGroup]="form">
  <rlb-color formControlName="favoriteColor"></rlb-color>
</form>
<p>Value: {{ form.value | json }}</p>`;

  sizeExample = `<rlb-color size="small"></rlb-color>
<rlb-color></rlb-color>
<rlb-color size="large"></rlb-color>`;

  disabledExample = `<rlb-color [disabled]="true" [value]="'#dc3545'"></rlb-color>`;

  readonlyExample = `<rlb-color [readonly]="true" [value]="'#198754'"></rlb-color>`;

  customIdExample = `<rlb-color id="my-color-picker"></rlb-color>`;

  api: DocApiRow[] = [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the color picker so the user cannot interact with it.', kind: 'Input' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the color picker read-only; the user cannot change the selected color.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", default: 'undefined', description: "Controls the visual size of the input. Use 'small' for a compact variant and 'large' for an enlarged one.", kind: 'Input' },
    { name: 'id', type: 'string', default: "''", description: 'Custom id attribute for the underlying input element. When omitted an auto-generated unique id is used.', kind: 'Input' },
    { name: '[before]', type: 'ng-content', description: 'Content projected before the color input inside the input group (e.g. an input-group addon).', kind: 'Content' },
    { name: '[after]', type: 'ng-content', description: 'Content projected after the color input inside the input group (e.g. a label or addon).', kind: 'Content' },
  ];
}
