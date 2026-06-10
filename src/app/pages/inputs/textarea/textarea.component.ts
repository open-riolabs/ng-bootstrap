import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TextareasComponent {
  private cdr = inject(ChangeDetectorRef);

  // ── Examples ────────────────────────────────────────────────────────────────

  basicExample = `<rlb-textarea></rlb-textarea>`;

  placeholderExample = `<rlb-textarea placeholder="Write your message here..."></rlb-textarea>`;

  rowsExample = `<rlb-textarea [rows]="2" placeholder="2 rows"></rlb-textarea>
<rlb-textarea [rows]="5" placeholder="5 rows"></rlb-textarea>`;

  sizeExample = `<rlb-textarea size="small" placeholder="Small textarea"></rlb-textarea>
<rlb-textarea placeholder="Default textarea"></rlb-textarea>
<rlb-textarea size="large" placeholder="Large textarea"></rlb-textarea>`;

  disabledReadonlyExample = `<rlb-textarea [disabled]="true" placeholder="Disabled textarea"></rlb-textarea>
<rlb-textarea [readonly]="true" placeholder="Readonly textarea"></rlb-textarea>`;

  reactiveFormExample = `<form [formGroup]="form" (ngSubmit)="submitForm()">
  <label class="form-label" for="bio">Bio (required, min 10 chars)</label>
  <rlb-textarea id="bio" formControlName="bio" placeholder="Tell us about yourself..."></rlb-textarea>

  <label class="form-label mt-3" for="notes">Notes (optional)</label>
  <rlb-textarea id="notes" formControlName="notes" [rows]="5" placeholder="Additional notes..."></rlb-textarea>

  <div class="mt-3 d-flex gap-2">
    <button rlb-button color="primary" type="submit">Submit</button>
    <button rlb-button outline color="secondary" type="button" (click)="resetForm()">Reset</button>
  </div>
</form>`;

  // ── Reactive form ────────────────────────────────────────────────────────────

  form: FormGroup;
  isSaving = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      bio: ['', [Validators.required, Validators.minLength(10)]],
      notes: [''],
    });
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.isSaving = true;
      this.form.disable();
      setTimeout(() => {
        this.isSaving = false;
        this.form.enable();
        alert('Submitted!\n\n' + JSON.stringify(this.form.value, null, 2));
        this.form.reset();
        this.cdr.markForCheck();
      }, 1500);
    } else {
      this.cdr.markForCheck();
    }
  }

  resetForm() {
    this.form.reset();
  }

  // ── API rows ─────────────────────────────────────────────────────────────────

  api: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom id for the native textarea element. If omitted, a unique id is auto-generated.',
      kind: 'Input',
    },
    {
      name: 'placeholder',
      type: 'string | undefined',
      description: 'Placeholder text shown when the textarea is empty.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the textarea, making it non-interactive. Also honoured when set programmatically via the forms API.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the textarea read-only: content is visible and focusable but cannot be edited.',
      kind: 'Input',
    },
    {
      name: 'rows',
      type: 'number',
      default: '3',
      description: 'Number of visible text lines rendered by the native textarea.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large' | undefined",
      description: "Applies Bootstrap's form-control sizing classes. Omit for the default (medium) size.",
      kind: 'Input',
    },
  ];
}
