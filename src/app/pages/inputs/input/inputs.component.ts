import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './inputs.component.html',
  standalone: false,
})
export class InputsComponent {
  html: string = `<rlb-input formControlName="myControl"></rlb-input>`;
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
}
