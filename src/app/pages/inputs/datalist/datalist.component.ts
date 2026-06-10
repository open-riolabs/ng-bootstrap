import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class DatalistsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fruit: ['', Validators.required],
    });
  }

  get formValue(): string {
    return JSON.stringify(this.form.value, null, 2);
  }

  basicExample = `<rlb-datalist placeholder="Type or pick a fruit...">
  <option>Apple</option>
  <option>Banana</option>
  <option>Cherry</option>
  <option>Date</option>
  <option>Elderberry</option>
</rlb-datalist>`;

  reactiveExample = `<form [formGroup]="form">
  <rlb-datalist formControlName="fruit" placeholder="Type or pick a fruit...">
    <option>Apple</option>
    <option>Banana</option>
    <option>Cherry</option>
    <option>Date</option>
    <option>Elderberry</option>
  </rlb-datalist>
</form>`;

  sizesExample = `<rlb-datalist size="small" placeholder="Small datalist">
  <option>Suggestion 1</option>
  <option>Suggestion 2</option>
</rlb-datalist>

<rlb-datalist placeholder="Default datalist">
  <option>Suggestion 1</option>
  <option>Suggestion 2</option>
</rlb-datalist>

<rlb-datalist size="large" placeholder="Large datalist">
  <option>Suggestion 1</option>
  <option>Suggestion 2</option>
</rlb-datalist>`;

  disabledExample = `<rlb-datalist [disabled]="true" placeholder="Disabled">
  <option>Suggestion 1</option>
</rlb-datalist>

<rlb-datalist [readonly]="true" placeholder="Read-only">
  <option>Suggestion 1</option>
</rlb-datalist>`;

  slotsExample = `<rlb-datalist placeholder="Pick a city...">
  <span before class="input-group-text"><i class="bi bi-geo-alt"></i></span>
  <option>London</option>
  <option>New York</option>
  <option>Paris</option>
  <option>Tokyo</option>
  <span after class="input-group-text">&#x1F30D;</span>
</rlb-datalist>`;

  api: DocApiRow[] = [
    // Own inputs
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom id for the underlying input element. If empty, a unique id is auto-generated.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the input when true. Accepts boolean attribute (no value = true).',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the input read-only, preventing user edits while keeping it focusable.',
      kind: 'Input',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown inside the input when it has no value.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large'",
      description: "Controls the Bootstrap input size. Use 'small' for form-control-sm or 'large' for form-control-lg. Omit for the default size.",
      kind: 'Input',
    },
    // Inherited from AbstractComponent / ControlValueAccessor
    {
      name: 'value',
      type: 'Signal<string | undefined>',
      description: 'Read-only signal that reflects the current control value. Updated on every user interaction.',
      kind: 'Input',
    },
    // Content slots
    {
      name: '[before]',
      type: 'ng-content',
      description: "Content projected before the input group (e.g. an input-group-text prepend). Add the attribute before to the element.",
      kind: 'Content',
    },
    {
      name: '(default)',
      type: 'ng-content',
      description: 'Default content slot — place native <option> elements here to populate the datalist suggestions.',
      kind: 'Content',
    },
    {
      name: '[after]',
      type: 'ng-content',
      description: "Content projected after the input group (e.g. an input-group-text append). Add the attribute after to the element.",
      kind: 'Content',
    },
  ];
}
