import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, EMPTY, map, Observable, of, tap } from 'rxjs';
import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class SelectsComponent implements OnInit {
  // ngModel + Async RxJS stream (regression test)
  result: { nextIntentId?: string } = { nextIntentId: 'intent_2' };
  intents: any[] = [];
  intentLoading = false;

  private fb = inject(FormBuilder);

  // Forms
  basicForm: FormGroup;
  form: FormGroup;
  chipsForm: FormGroup;

  // State via signals
  isSaving = signal(false);
  isLoadingOptions = signal(true);
  asyncOptions = signal<{ id: string; name: string }[]>([]);

  // ── Example code strings ──────────────────────────────────────────────────

  basicExample = `<rlb-select formControlName="select" placeholder="Select option">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2">Option 2</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-select>`;

  multipleExample = `<rlb-select formControlName="skills" multiple placeholder="Select skills" enable-validation="true">
  <rlb-option value="ts">TypeScript</rlb-option>
  <rlb-option value="rxjs">RxJS</rlb-option>
  <rlb-option value="ngrx">NgRx</rlb-option>
  <rlb-option value="signals">Signals</rlb-option>
</rlb-select>`;

  sizesExample = `<rlb-select placeholder="Default size">
  <rlb-option value="a">Option A</rlb-option>
</rlb-select>

<rlb-select size="small" placeholder="Small size">
  <rlb-option value="a">Option A</rlb-option>
</rlb-select>

<rlb-select size="large" placeholder="Large size">
  <rlb-option value="a">Option A</rlb-option>
</rlb-select>`;

  disabledExample = `<rlb-select disabled placeholder="Disabled select">
  <rlb-option value="1">Option 1</rlb-option>
</rlb-select>

<rlb-select placeholder="Option 2 disabled">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2" disabled>Option 2 (disabled)</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-select>`;

  validationExample = `<rlb-select formControlName="basicSelect" placeholder="Choose a framework" enable-validation="true">
  <rlb-option value="angular">Angular</rlb-option>
  <rlb-option value="react">React</rlb-option>
  <rlb-option value="vue">Vue</rlb-option>
</rlb-select>`;

  asyncExample = `<rlb-select formControlName="asyncSelect" placeholder="Select a user" enable-validation="true">
  @for (user of asyncOptions(); track user.id) {
    <rlb-option [value]="user.id">{{ user.name }}</rlb-option>
  }
</rlb-select>`;

  languageChipsExample = `<!-- Default options: EN, IT, DE, FR, ES, PT -->
<rlb-language-chips formControlName="languages"></rlb-language-chips>

<!-- Custom option set + placeholder -->
<rlb-language-chips
  formControlName="languages"
  [options]="['EN', 'IT', 'DE', 'FR']"
  placeholder="Add language...">
</rlb-language-chips>`;

  ngModelExample = `<rlb-select size="small" [(ngModel)]="result.nextIntentId">
  <label before class="form-label d-block w-100 mb-2">
    Next Intent
    @if (intentLoading) {
      <span class="spinner-border spinner-border-sm text-primary ms-2"
            role="status" aria-label="Loading intents..."></span>
    }
  </label>
  @for (intent of intents; track intent._id) {
    <rlb-option [value]="intent._id">{{ intent.name }}</rlb-option>
  }
</rlb-select>`;

  // ── API rows ──────────────────────────────────────────────────────────────

  selectApi: DocApiRow[] = [
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text shown as the first disabled option when no value is selected. Only visible in single-select mode.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large'",
      description: "Visual size of the select control. Maps to Bootstrap's form-select-sm / form-select-lg CSS classes.",
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the select element so no interaction is possible.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Sets the readonly attribute on the underlying select element (note: browser support for readonly on select is limited).',
      kind: 'Input',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Enables multi-selection. The bound value becomes string[] instead of string.',
      kind: 'Input',
    },
    {
      name: 'display',
      type: 'number',
      description: 'Sets the HTML size attribute on the select element, controlling how many options are visible without scrolling.',
      kind: 'Input',
    },
    {
      name: 'inputId',
      type: 'string',
      description: 'Custom id forwarded to the native select element. An auto-generated id is used when omitted.',
      kind: 'Input',
    },
    {
      name: 'enable-validation',
      type: 'boolean',
      default: 'false',
      description: 'When true the component adds is-valid / is-invalid Bootstrap classes and renders inline validation messages based on the form control state.',
      kind: 'Input',
    },
    {
      name: '[before] slot',
      type: 'ng-content',
      description: 'Content projected with the before attribute is rendered above the select element (e.g. a label).',
      kind: 'Content',
    },
    {
      name: '[after] slot',
      type: 'ng-content',
      description: 'Content projected with the after attribute is rendered below the select element.',
      kind: 'Content',
    },
  ];

  optionApi: DocApiRow[] = [
    {
      name: 'value',
      type: 'string | number | null | undefined',
      description: 'The value emitted to the form control when this option is selected.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables this individual option so it cannot be selected.',
      kind: 'Input',
    },
  ];

  languageChipsApi: DocApiRow[] = [
    {
      name: 'options',
      type: 'string[]',
      default: "['EN', 'IT', 'DE', 'FR', 'ES', 'PT']",
      description: 'The full set of selectable values. The dropdown lists only those not yet chosen.',
      kind: 'Input',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Add...'",
      description: 'Placeholder shown in the control when nothing is selected.',
      kind: 'Input',
    },
    {
      name: 'maxVisible',
      type: 'number',
      default: '2',
      description: "How many chips to render inline before collapsing the remainder into a '(+N others)' label.",
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the control so the dropdown cannot be opened and the selection cannot be changed. Also toggled automatically when the form control is disabled.',
      kind: 'Input',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Custom id for the control. An auto-generated id is used when omitted.',
      kind: 'Input',
    },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  constructor() {
    this.basicForm = this.fb.group({
      select: ['', Validators.required],
    });

    this.form = this.fb.group({
      basicSelect: ['', Validators.required],
      multiSelect: [[], Validators.required],
      asyncSelect: ['', Validators.required],
    });

    this.chipsForm = this.fb.group({
      languages: [['EN', 'IT']],
    });
  }

  ngOnInit(): void {
    // Simulate fetching options from an API for the Async Select
    setTimeout(() => {
      this.asyncOptions.set([
        { id: 'u1', name: 'Alice Smith' },
        { id: 'u2', name: 'Bob Johnson' },
        { id: 'u3', name: 'Charlie Brown' },
      ]);
      this.isLoadingOptions.set(false);
    }, 1500);

    this.loadIntents();
  }

  private loadIntents(): void {
    this.intentLoading = true;

    this.mockIntentService()
      .pipe(
        map(intents => intents.filter(intent => intent.enabled)),
        tap(intents => (this.intents = intents)),
        tap(() => {
          this.intentLoading = false;
        }),
        catchError(() => {
          this.intentLoading = false;
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private mockIntentService(): Observable<any[]> {
    return of([
      { _id: 'intent_1', name: 'Greeting Intent', enabled: true },
      { _id: 'intent_2', name: 'Support Intent', enabled: true },
      { _id: 'intent_3', name: 'Deprecated Intent', enabled: false },
      { _id: 'intent_4', name: 'Closing Intent', enabled: true },
    ]).pipe(delay(1500));
  }

  patchData(): void {
    this.form.patchValue({
      basicSelect: 'vue',
      multiSelect: ['ts', 'signals'],
      asyncSelect: 'u2',
    });
  }

  submitForm(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.isSaving.set(true);
      this.form.disable();

      // Simulate API call
      setTimeout(() => {
        this.isSaving.set(false);
        this.form.enable();
        alert('Form saved successfully! \n\n' + JSON.stringify(this.form.value, null, 2));
        this.form.reset();
      }, 2000);
    }
  }
}
