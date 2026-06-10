import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class SwitchesComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      notifications: [false],
      terms: [false, Validators.requiredTrue],
    });
  }

  get termsControl() {
    return this.form.get('terms');
  }

  // ── Example code strings ──────────────────────────────────────────────────

  basicExample = `<rlb-switch>
  <label class="form-check-label" after>Enable notifications</label>
</rlb-switch>`;

  labelPositionExample = `<!-- Label before the toggle -->
<rlb-switch>
  <label class="form-check-label" before>Dark mode</label>
</rlb-switch>

<!-- Label after the toggle -->
<rlb-switch>
  <label class="form-check-label" after>Dark mode</label>
</rlb-switch>`;

  sizesExample = `<rlb-switch size="small">
  <label class="form-check-label" after>Small switch</label>
</rlb-switch>

<rlb-switch>
  <label class="form-check-label" after>Default switch</label>
</rlb-switch>

<rlb-switch size="large">
  <label class="form-check-label" after>Large switch</label>
</rlb-switch>`;

  disabledExample = `<rlb-switch [disabled]="true">
  <label class="form-check-label" after>Disabled (off)</label>
</rlb-switch>

<rlb-switch [disabled]="true" [formControl]="disabledOnCtrl">
  <label class="form-check-label" after>Disabled (on)</label>
</rlb-switch>`;

  readonlyExample = `<rlb-switch [readonly]="true">
  <label class="form-check-label" after>Read-only</label>
</rlb-switch>`;

  reactiveExample = `<form [formGroup]="form">
  <rlb-switch formControlName="notifications">
    <label class="form-check-label" after>Email notifications</label>
  </rlb-switch>

  <rlb-switch formControlName="terms">
    <label class="form-check-label" after>I accept the terms and conditions</label>
  </rlb-switch>
</form>`;

  // ── API table ─────────────────────────────────────────────────────────────

  api: DocApiRow[] = [
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the switch, preventing user interaction. Also set automatically when the bound FormControl is disabled.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the switch read-only — it renders as enabled but cannot be toggled by the user.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large' | undefined",
      default: 'undefined',
      description: "Adjusts the visual size of the toggle. Omit (or pass undefined) for the default Bootstrap size.",
      kind: 'Input',
    },
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom HTML id for the underlying checkbox input. An auto-generated unique id is used when not provided.',
      kind: 'Input',
    },
    {
      name: '[before]',
      type: 'TemplateRef',
      description: 'Content slot projected to the left of the toggle (e.g. a label or icon).',
      kind: 'Content',
    },
    {
      name: '[after]',
      type: 'TemplateRef',
      description: 'Content slot projected to the right of the toggle (e.g. a label or icon).',
      kind: 'Content',
    },
  ];
}
