import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class WizardsComponent {
  /** Active step, bound one-way to the carousel and updated by the Back/Next buttons. */
  readonly page = signal(0);
  /** Number of slides, reported by the carousel via (slide-count). */
  readonly count = signal(0);

  readonly steps = ['Account', 'Profile', 'Confirm'];
  /** FormGroup name behind each step, used to validate one step at a time. */
  readonly groupNames = ['account', 'profile', 'confirm'];

  readonly form = new FormGroup({
    account: new FormGroup({
      type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    }),
    profile: new FormGroup({
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl(''),
      city: new FormControl(''),
    }),
    confirm: new FormGroup({
      agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    }),
  });

  readonly isLast = computed(() => this.page() === this.count() - 1);

  /** True while the current step's FormGroup is invalid — used to gate the Next button. */
  currentStepInvalid(): boolean {
    const group = this.form.get(this.groupNames[this.page()]);
    return !!group && group.invalid;
  }

  prev(): void {
    this.page.update(p => Math.max(0, p - 1));
  }

  next(): void {
    this.page.update(p => Math.min(this.count() - 1, p + 1));
  }

  finish(): void {
    if (this.form.invalid) return;
    // Submit this.form.getRawValue() here…
    this.page.set(0);
    this.form.reset();
  }

  optionsApi: DocApiRow[] = [
    { name: 'autoplay', type: "'auto' | 'manual' | 'none'", default: "'auto'", description: "Set to 'none' so steps never advance on their own.", kind: 'Input' },
    { name: 'no-touch', type: 'boolean', default: 'false', description: 'Disable swipe so users move only via your Back / Next buttons.', kind: 'Input' },
    { name: 'hide-controls', type: 'boolean', default: 'false', description: 'Hide the built-in previous/next arrows.', kind: 'Input' },
    { name: 'hide-indicators', type: 'boolean', default: 'false', description: 'Hide the slide dots.', kind: 'Input' },
    { name: 'current-slide', type: 'number', default: '0', description: 'Bind to your active-step signal. Bound one-way here and updated from the footer buttons.', kind: 'Two-way' },
    { name: 'slide-count', type: 'number', description: 'Emits the number of steps; store it to know when you reach the last one.', kind: 'Output' },
  ];

  htmlSnippet = `<rlb-carousel
  autoplay="none"
  no-touch
  hide-controls
  hide-indicators
  [current-slide]="page()"
  (current-slideChange)="page.set($event)"
  (slide-count)="count.set($event)"
  id="wizard-carousel"
  [formGroup]="form">

  <rlb-carousel-slide active>
    <div formGroupName="account">
      <rlb-select formControlName="type"><label before>Account type</label>
        <rlb-option [value]="''" disabled>—</rlb-option>
        <rlb-option value="personal">Personal</rlb-option>
        <rlb-option value="business">Business</rlb-option>
      </rlb-select>
      <rlb-input formControlName="username"><label before>Username</label></rlb-input>
      <rlb-input type="email" formControlName="email"><label before>Email</label></rlb-input>
    </div>
  </rlb-carousel-slide>

  <rlb-carousel-slide>
    <div formGroupName="profile">
      <rlb-input formControlName="firstName"><label before>First name</label></rlb-input>
      <rlb-input formControlName="lastName"><label before>Last name</label></rlb-input>
      <rlb-input formControlName="city"><label before>City</label></rlb-input>
    </div>
  </rlb-carousel-slide>

  <rlb-carousel-slide>
    <!-- review &amp; confirm -->
  </rlb-carousel-slide>
</rlb-carousel>

<!-- footer -->
<button rlb-button outline [disabled]="page() === 0" (click)="prev()">Back</button>
@if (!isLast()) {
  <button rlb-button color="primary" [disabled]="currentStepInvalid()" (click)="next()">Next</button>
} @else {
  <button rlb-button color="success" [disabled]="form.invalid" (click)="finish()">Finish</button>
}`;

  tsSnippet = `export class WizardComponent {
  readonly page = signal(0);   // bound to [current-slide]
  readonly count = signal(0);  // set from (slide-count)

  readonly groupNames = ['account', 'profile', 'confirm'];
  readonly isLast = computed(() => this.page() === this.count() - 1);

  readonly form = new FormGroup({
    account: new FormGroup({ /* type, username, email … */ }),
    profile: new FormGroup({ /* firstName, lastName, city */ }),
    confirm: new FormGroup({ agree: new FormControl(false, Validators.requiredTrue) }),
  });

  // Gate "Next" on the validity of the current step only.
  currentStepInvalid(): boolean {
    return !!this.form.get(this.groupNames[this.page()])?.invalid;
  }

  prev() { this.page.update(p => Math.max(0, p - 1)); }
  next() { this.page.update(p => Math.min(this.count() - 1, p + 1)); }
}`;
}
