import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-input',
  templateUrl: './inputs.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class InputsComponent {
  form!: FormGroup;
  isSaving = false;
  input = '';

  private cdr = inject(ChangeDetectorRef);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      basicText: ['', Validators.required],
      numberInput: [null, [Validators.required, Validators.min(10), Validators.max(100)]],
      dateInput: ['', Validators.required],
      asyncEmail: [
        '',
        [Validators.required, Validators.email],
        [this.emailAvailableValidator.bind(this)],
      ],
    });
  }

  // patching values (Simulates receiving data from backend)
  patchData() {
    this.form.patchValue({
      basicText: 'Patched Value!',
      numberInput: 42,
      dateInput: '2025-01-01T12:00',
      asyncEmail: 'patched@test.com',
    });
  }

  logValues() {
    console.log('Form Value:', this.form.value);
  }

  // Async Form Submission (Simulates Saving)
  submitForm() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.isSaving = true;
      this.form.disable();

      // Simulate API Call
      setTimeout(() => {
        this.isSaving = false;
        this.form.enable();
        alert('Form saved successfully! \n\n' + JSON.stringify(this.form.value, null, 2));
        this.form.reset();
        this.cdr.markForCheck(); // Required for zoneless setTimeout
      }, 2000);
    } else {
      this.cdr.markForCheck();
    }
  }

  // Example: Async Validator
  emailAvailableValidator(control: AbstractControl) {
    // Simulates an HTTP call to check if email exists
    return of(control.value === 'taken@test.com' ? { emailTaken: true } : null).pipe(delay(1000));
  }

  basicExample = `<rlb-input [(ngModel)]="input" placeholder="Type something..."></rlb-input>`;

  typesExample = `<rlb-input type="text" placeholder="Text input"></rlb-input>
<rlb-input type="email" placeholder="Email input"></rlb-input>
<rlb-input type="password" placeholder="Password input"></rlb-input>
<rlb-input type="number" placeholder="Number input" [min]="0" [max]="100"></rlb-input>
<rlb-input type="datetime-local"></rlb-input>`;

  sizesExample = `<rlb-input size="small" placeholder="Small input"></rlb-input>
<rlb-input placeholder="Default input"></rlb-input>
<rlb-input size="large" placeholder="Large input"></rlb-input>`;

  disabledReadonlyExample = `<rlb-input [disabled]="true" placeholder="Disabled input"></rlb-input>
<rlb-input [readonly]="true" placeholder="Readonly input"></rlb-input>`;

  advancedFormExample = `<form [formGroup]="form" (ngSubmit)="submitForm()" class="row g-3">

  <div class="col-md-6">
    <rlb-input inputId="demo-basic-text" formControlName="basicText" enable-validation="true">
      <label for="demo-basic-text" class="form-label d-block w-100 mb-2" before>Basic Text (Required)</label>
    </rlb-input>
  </div>

  <div class="col-md-6">
    <label for="demo-number-input" class="form-label">Number (Min 10, Max 100)</label>
    <rlb-input inputId="demo-number-input" type="number" formControlName="numberInput"
      [min]="10" [max]="100" enable-validation="true"></rlb-input>
  </div>

  <div class="col-md-6">
    <label for="demo-date-input" class="form-label">Datetime Local (String Output)</label>
    <rlb-input enable-validation="true" inputId="demo-date-input"
      type="datetime-local" date-type="string" formControlName="dateInput"></rlb-input>
  </div>

  <div class="col-md-6">
    <label for="demo-email-input" class="form-label">
      Async Email Validation
      @if (form.get('asyncEmail')?.pending) {
        <span class="spinner-border spinner-border-sm text-primary ms-2" role="status"></span>
      }
    </label>
    <rlb-input inputId="demo-email-input" type="email"
      formControlName="asyncEmail" enable-validation="true"></rlb-input>
    <div class="form-text">Type <code>taken&#64;test.com</code> to trigger async error (1s delay).</div>
  </div>

  <div class="col-12 mt-4 d-flex gap-2">
    <button rlb-button outline color="secondary" type="button" (click)="patchData()">
      Patch Mock Data
    </button>
    <button rlb-button color="primary" type="submit" [disabled]="isSaving || form.pending">
      @if (isSaving) {
        <rlb-spinner class="spinner-border spinner-border-sm me-2" role="status"></rlb-spinner>
        Saving...
      } @else {
        Submit
      }
    </button>
  </div>
</form>`;

  api: DocApiRow[] = [
    // Own inputs
    {
      name: 'type',
      type: 'string',
      default: "'text'",
      description: "HTML input type: text, email, number, password, search, tel, url, datetime-local, etc.",
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large'",
      description: "Controls the Bootstrap size class applied to the input: small adds form-control-sm, large adds form-control-lg.",
      kind: 'Input',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum value constraint for number inputs. Values below this are clamped on input.',
      kind: 'Input',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum value constraint for number inputs. Values above this are clamped on input.',
      kind: 'Input',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Step interval for number inputs.',
      kind: 'Input',
    },
    {
      name: 'date-type',
      type: "'date' | 'string' | 'number' | 'date-tz'",
      default: "'date-tz'",
      description: "Output format when type is datetime-local. string emits the raw string value, number emits a Unix timestamp, date emits a native Date, date-tz emits a DateTz object.",
      kind: 'Input',
    },
    {
      name: 'timezone',
      type: 'string',
      default: "'UTC'",
      description: "IANA timezone used to parse and format datetime-local values when date-type is date-tz.",
      kind: 'Input',
    },
    {
      name: 'inputId',
      type: 'string',
      description: 'Custom id applied to the underlying input element. If omitted a unique id is generated automatically.',
      kind: 'Input',
    },
    {
      name: 'enable-validation',
      type: 'boolean',
      default: 'false',
      description: 'When true, applies is-valid / is-invalid Bootstrap classes based on the bound form control state once the field is touched.',
      kind: 'Input',
    },
    {
      name: 'ext-validation',
      type: 'boolean',
      default: 'false',
      description: 'Suppresses the built-in inline error message so a parent component can render its own validation UI.',
      kind: 'Input',
    },
    // Inherited from AbstractComponent
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the input. Also automatically set when the parent reactive form control is disabled via FormGroup.disable().',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the input read-only. The value is still submitted but the user cannot change it.',
      kind: 'Input',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown inside the input when it is empty.',
      kind: 'Input',
    },
    {
      name: 'name',
      type: 'string',
      description: 'HTML name attribute forwarded to the underlying input element.',
      kind: 'Input',
    },
    // Content slots
    {
      name: 'before',
      type: 'ng-content [before]',
      description: 'Content projected before the input element, typically a label element.',
      kind: 'Content',
    },
    {
      name: 'after',
      type: 'ng-content [after]',
      description: 'Content projected after the input element, useful for addons or helper text.',
      kind: 'Content',
    },
    // Method
    {
      name: 'setExtValidation(val: boolean)',
      type: 'void',
      description: 'Programmatically enable or disable external validation mode at runtime.',
      kind: 'Method',
    },
  ];
}
