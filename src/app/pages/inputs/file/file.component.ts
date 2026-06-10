import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class FilesComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      attachment: [null, Validators.required],
    });
  }

  get selectedFile(): File | null {
    return this.form.get('attachment')?.value ?? null;
  }

  basicExample = `<rlb-file></rlb-file>`;

  multipleExample = `<rlb-file [multiple]="true"></rlb-file>`;

  acceptExample = `<rlb-file accept="image/*"></rlb-file>`;

  sizesExample = `<rlb-file size="small"></rlb-file>
<rlb-file></rlb-file>
<rlb-file size="large"></rlb-file>`;

  disabledExample = `<rlb-file [disabled]="true"></rlb-file>`;

  reactiveExample = `<form [formGroup]="form">
  <rlb-file formControlName="attachment"></rlb-file>
</form>`;

  api: DocApiRow[] = [
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the file input when true. Also controlled by the parent form via ControlValueAccessor.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Marks the underlying input as read-only.',
      kind: 'Input',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Allows selecting multiple files when true. The form-control value becomes File[] instead of File.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large' | undefined",
      default: 'undefined',
      description: "Adjusts the input size. 'small' applies form-control-sm; 'large' applies form-control-lg.",
      kind: 'Input',
    },
    {
      name: 'accept',
      type: 'string | undefined',
      default: 'undefined',
      description: "Passed directly to the native accept attribute (e.g. 'image/*' or '.jpg,.png').",
      kind: 'Input',
    },
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom ID for the native input element. When omitted, a unique ID is auto-generated.',
      kind: 'Input',
    },
    {
      name: 'value',
      type: 'Signal<File | File[] | null | undefined>',
      description: 'Read-only signal exposing the current file value. Use Angular forms for two-way binding.',
      kind: 'Two-way',
    },
    {
      name: 'invalid',
      type: 'Signal<boolean>',
      description: 'Computed signal that mirrors the bound form control invalid state.',
      kind: 'Two-way',
    },
    {
      name: 'showError',
      type: 'Signal<boolean>',
      description: 'Computed signal that is true when the field is invalid and touched or dirty.',
      kind: 'Two-way',
    },
    {
      name: '[before]',
      type: 'ng-content',
      description: "Named content slot projected before the input group. Use the attribute selector [before] on the element (e.g. &lt;label before&gt;).",
      kind: 'Content',
    },
    {
      name: '[after]',
      type: 'ng-content',
      description: "Named content slot projected after the input group. Use the attribute selector [after] on the element.",
      kind: 'Content',
    },
  ];
}
