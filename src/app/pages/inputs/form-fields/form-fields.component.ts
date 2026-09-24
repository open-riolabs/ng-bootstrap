import { Component, signal } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormFieldsDefinition } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class FormFieldsDocComponent {
  readonly submitted = signal<unknown>(undefined);

  readonly basicFields: FormFieldsDefinition = {
    email: { name: 'Email', label: 'Email', type: 'email', cols: 'col-12 col-md-6', validators: [Validators.required, Validators.email] },
    password: { name: 'Password', label: 'Password', type: 'password', cols: 'col-12 col-md-6', validators: [Validators.required] },
  };

  readonly seededFields: FormFieldsDefinition = {
    city: { name: 'City', label: 'City', type: 'text', cols: 'col-12 col-md-6', value: 'Milano' },
    newsletter: { name: 'Newsletter', label: 'Newsletter', type: 'switch', cols: 'col-12 col-md-6', value: true },
  };

  readonly plainFields: FormFieldsDefinition = {
    search: { name: 'Search', type: 'search', cols: 'col-12' },
  };

  basicExample = `readonly fields: FormFieldsDefinition = {
  email: {
    name: 'Email', label: 'Email', type: 'email',
    cols: 'col-12 col-md-6',
    validators: [Validators.required, Validators.email],
  },
  password: {
    name: 'Password', label: 'Password', type: 'password',
    cols: 'col-12 col-md-6',
    validators: [Validators.required],
  },
};

<rlb-form-fields
  title="Sign in"
  [fields]="fields"
  (submit)="onSubmit($event)"
/>`;

  valueExample = `// Without value a text field starts empty and a switch starts off.
readonly fields: FormFieldsDefinition = {
  city: { name: 'City', label: 'City', type: 'text', value: 'Milano' },
  newsletter: { name: 'Newsletter', label: 'Newsletter', type: 'switch', value: true },
};`;

  chromeExample = `<!-- no-card drops the surrounding card, no-submit drops the button. -->
<rlb-form-fields
  [fields]="fields"
  no-card
  no-submit
/>`;

  i18nExample = `// name and label are passed through the rlbTranslate pipe, which resolves them
// against RLB_TRANSLATION_SERVICE when the application registered one, and returns
// them unchanged when it did not. So these can be plain words or translation keys.
readonly fields: FormFieldsDefinition = {
  email: { name: 'form.email.placeholder', label: 'form.email.label', type: 'email' },
};

// Bridging @ngx-translate:
providers: [{ provide: RLB_TRANSLATION_SERVICE, useExisting: TranslateService }]`;

  onSubmit(value: unknown) {
    this.submitted.set(value);
  }

  api: DocApiRow[] = [
    { name: 'fields', type: 'FormFieldsDefinition | undefined', default: 'undefined', description: 'The form, as data. Each key becomes a FormControl of that name.', kind: 'Input' },
    { name: 'title', type: 'string', default: "''", description: 'Heading inside the card. Passed through the translation pipe.', kind: 'Input' },
    { name: 'sub-title', type: 'string', default: "''", description: 'Text under the heading. Passed through the translation pipe.', kind: 'Input' },
    { name: 'no-card', type: 'boolean', default: 'false', description: 'Render the fields without the surrounding card.', kind: 'Input' },
    { name: 'no-submit', type: 'boolean', default: 'false', description: 'Hide the submit button, for when the form is driven from outside.', kind: 'Input' },
    { name: 'submit', type: 'any', description: 'Emitted with the form value when it is submitted and valid.', kind: 'Output' },
    { name: 'submitForm()', type: 'void', description: 'Submits the form from outside, for use together with no-submit.', kind: 'Method' },
  ];

  fieldApi: DocApiRow[] = [
    { name: 'name', type: 'string', description: 'Placeholder for the control. Passed through the translation pipe, so it can be a key.', kind: 'Input' },
    { name: 'label', type: 'string | undefined', default: 'undefined', description: 'Label shown before the control. Also translated.', kind: 'Input' },
    { name: 'type', type: "'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'switch' | string", description: 'Which control to render. The text-like types all render an rlb-input of that HTML type; switch renders an rlb-switch.', kind: 'Input' },
    { name: 'value', type: 'any', default: 'undefined', description: 'What the control starts on. Left out, a text field starts empty and a switch starts off.', kind: 'Input' },
    { name: 'cols', type: 'string | undefined', default: 'undefined', description: 'Bootstrap grid classes for the column wrapping this field, e.g. "col-12 col-md-6".', kind: 'Input' },
    { name: 'validators', type: 'ValidatorFn | ValidatorFn[] | undefined', default: 'undefined', description: 'Angular validators applied to this control.', kind: 'Input' },
  ];
}
