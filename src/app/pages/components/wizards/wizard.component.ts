import { Component, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class WizardsComponent {
  readonly stepper = viewChild(StepperComponent);
  readonly submitted = signal<unknown>(undefined);

  readonly account = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  readonly profile = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl(''),
  });

  readonly confirm = new FormGroup({
    agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  readonly form = new FormGroup({
    account: this.account,
    profile: this.profile,
    confirm: this.confirm,
  });

  basicExample = `<rlb-stepper linear (finish)="submit()">
  <rlb-step label="Account" [step-control]="account">
    <!-- the fields of step one -->
  </rlb-step>
  <rlb-step label="Profile" [step-control]="profile" hint="Nearly there">
    <!-- … -->
  </rlb-step>
  <rlb-step label="Confirm" [step-control]="confirm">
    <!-- … -->
  </rlb-step>
</rlb-stepper>

<button rlb-button outline [disabled]="stepper.isFirst()" (click)="stepper.previous()">Back</button>
<button rlb-button (click)="stepper.next()">
  {{ stepper.isLast() ? 'Finish' : 'Next' }}
</button>`;

  verticalExample = `<rlb-stepper orientation="vertical">
  <rlb-step label="One">…</rlb-step>
  <rlb-step label="Two">…</rlb-step>
</rlb-stepper>`;

  submit() {
    this.submitted.set(this.form.getRawValue());
  }

  reset() {
    this.form.reset();
    this.submitted.set(undefined);
    this.stepper()?.reset();
  }

  stepperApi: DocApiRow[] = [
    { name: 'selectedIndex', type: 'number', default: '0', description: 'Which step is showing. Two-way, so the page can put it in the URL.', kind: 'Two-way' },
    { name: 'linear', type: 'boolean', default: 'false', description: 'Refuses to move past a step that is not passable, and refuses to jump ahead over one. Without it the strip is navigation and the user may wander.', kind: 'Input' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Where the strip of steps goes.', kind: 'Input' },
    { name: 'optionalLabel', type: 'string', default: "'Optional'", description: 'What an optional step says under its label when it has no hint of its own.', kind: 'Input' },
    { name: 'finish', type: 'void', description: 'The user asked to finish from the last step.', kind: 'Output' },
    { name: 'next()', type: 'boolean', description: 'Moves on, or returns false and marks the step control touched — refusing silently leaves the user pressing a button that does nothing.', kind: 'Method' },
    { name: 'previous() / reset() / select(index)', type: 'void', description: 'The rest of the navigation. select refuses a step the linear rule has not opened yet.', kind: 'Method' },
    { name: 'isFirst() / isLast() / currentPassable()', type: 'Signal<boolean>', description: 'For wiring the buttons: whether to show Back, whether Next means Finish, and whether the current step would let go.', kind: 'Method' },
  ];

  stepApi: DocApiRow[] = [
    { name: 'label', type: 'string', default: "''", description: 'What this step is called in the strip.', kind: 'Input' },
    { name: 'hint', type: 'string | undefined', default: 'undefined', description: 'A line under the label.', kind: 'Input' },
    { name: 'step-control', type: 'AbstractControl | undefined', default: 'undefined', description: 'The form this step is responsible for. A linear stepper refuses to move past it while it is invalid.', kind: 'Input' },
    { name: 'optional', type: 'boolean', default: 'false', description: 'A step the user may skip even in a linear stepper.', kind: 'Input' },
    { name: 'completed', type: 'boolean', default: 'false', description: 'Marks the step finished even if it has no control to prove it.', kind: 'Input' },
    { name: 'state', type: "'todo' | 'done' | 'error' | undefined", default: 'undefined', description: 'Forces the circle. Left alone it is worked out from step-control and from what came before.', kind: 'Input' },
    { name: '(default)', type: 'ng-content', description: 'The body of the step. It stays in the DOM while another step is showing, merely hidden — tearing down the fields of step one would throw away everything typed into them.', kind: 'Content' },
  ];
}
