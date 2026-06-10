import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteFn, AutocompleteItem } from '@open-rlb/ng-bootstrap';
import { delay, Observable, of } from 'rxjs';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class AutocompletesComponent {
  advForm: FormGroup;
  isSaving = false;
  private cdr = inject(ChangeDetectorRef);

  // ── Static source ────────────────────────────────────────────────────────
  staticExample = `<rlb-autocomplete
  [placeholder]="'Search city...'"
  [autocomplete]="searchCities"
  (selected)="onCitySelect($event)">
</rlb-autocomplete>`;

  cities = ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'];

  searchCities: AutocompleteFn = (q?: string) => {
    if (!q) return this.cities;
    return this.cities.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  };

  onCitySelect(item: AutocompleteItem) {
    console.log('Selected city:', item);
  }

  // ── Promise source ───────────────────────────────────────────────────────
  promiseExample = `<rlb-autocomplete
  [placeholder]="'Search product...'"
  [autocomplete]="searchProducts"
  (selected)="onProductSelect($event)">
</rlb-autocomplete>`;

  products: AutocompleteItem[] = [
    { text: 'Laptop', value: 'p1' },
    { text: 'Phone', value: 'p2' },
    { text: 'Headphones', value: 'p3' },
  ];

  searchProducts: AutocompleteFn = (q?: string) => {
    return new Promise<AutocompleteItem[]>(resolve => {
      setTimeout(() => {
        if (!q) {
          resolve(this.products);
        } else {
          resolve(
            this.products.filter(
              p => typeof p !== 'string' && p.text.toLowerCase().includes(q.toLowerCase()),
            ),
          );
        }
      }, 800);
    });
  };

  onProductSelect(item: AutocompleteItem) {
    console.log('Selected product:', item);
  }

  // ── Observable source ────────────────────────────────────────────────────
  observableExample = `<rlb-autocomplete
  [placeholder]="'Search user...'"
  [autocomplete]="searchUsers"
  [chars-to-search]="2"
  (selected)="onUserSelect($event)">
</rlb-autocomplete>`;

  users: AutocompleteItem[] = [
    { text: 'Alice', value: '1' },
    { text: 'Bob', value: '2' },
    { text: 'Charlie', value: '3' },
  ];

  searchUsers: AutocompleteFn = (q?: string): Observable<AutocompleteItem[]> => {
    const filtered = !q
      ? this.users
      : this.users.filter(
          u => typeof u !== 'string' && u.text.toLowerCase().includes(q.toLowerCase()),
        );
    return of(filtered).pipe(delay(500));
  };

  onUserSelect(item: AutocompleteItem) {
    console.log('Selected user:', item);
  }

  // ── Reactive Forms ───────────────────────────────────────────────────────
  reactiveExample = `<form [formGroup]="form">
  <rlb-autocomplete
    formControlName="country"
    [placeholder]="'Search country...'"
    [autocomplete]="searchCountries">
  </rlb-autocomplete>
</form>
<p>Form value: {{ form.value | json }}</p>`;

  form!: FormGroup;
  countries = ['Italy', 'Spain', 'Germany', 'France', 'Portugal'];

  searchCountries: AutocompleteFn = (q?: string) => {
    if (!q) return this.countries;
    return this.countries.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  };

  // ── Initial suggestions ──────────────────────────────────────────────────
  initialSuggestionsExample = `<rlb-autocomplete
  [placeholder]="'Focus to see suggestions...'"
  [initial-suggestions]="recentCities"
  [autocomplete]="searchCities"
  (selected)="onCitySelect($event)">
</rlb-autocomplete>`;

  recentCities: AutocompleteItem[] = [
    { text: 'Rome (recent)', value: 'RM' },
    { text: 'Milan (recent)', value: 'MI' },
  ];

  // ── Disabled items ───────────────────────────────────────────────────────
  disabledItemsExample = `<rlb-autocomplete
  [placeholder]="'Focus to see items...'"
  [initial-suggestions]="productsWithDisabled"
  [autocomplete]="searchDisabledItems"
  (selected)="onProductSelect($event)">
</rlb-autocomplete>`;

  productsWithDisabled: AutocompleteItem[] = [
    { text: 'Laptop', value: 'p1' },
    { text: 'Phone (out of stock)', value: 'p2', disabled: true },
    { text: 'Headphones', value: 'p3' },
    { text: 'Tablet (discontinued)', value: 'p4', disabled: true },
  ];

  searchDisabledItems: AutocompleteFn = (q?: string) => {
    if (!q) return this.productsWithDisabled;
    return this.productsWithDisabled.filter(
      p => typeof p !== 'string' && p.text.toLowerCase().includes((q ?? '').toLowerCase()),
    );
  };

  // ── Advanced form (validation + specialised components) ──────────────────
  advancedExample = `<form [formGroup]="advForm" (ngSubmit)="submitForm()" class="row g-3">

  <div class="col-md-6">
    <label class="form-label">Country</label>
    <rlb-autocomplete
      open-on-focus
      formControlName="country"
      [autocomplete]="searchCountries"
      placeholder="Search country..."
      enable-validation="true">
    </rlb-autocomplete>
  </div>

  <div class="col-md-6">
    <label class="form-label">Assign to User</label>
    <rlb-autocomplete
      formControlName="user"
      [autocomplete]="searchUsers"
      [chars-to-search]="1"
      placeholder="Type 'Alice'..."
      enable-validation="true">
    </rlb-autocomplete>
    <div class="form-text">Validation: 'Charlie' is restricted.</div>
  </div>

  <div class="col-md-6">
    <label class="form-label">Birth Country</label>
    <rlb-autocomplete-country
      open-on-focus
      enable-flag-icons
      detect-locale
      formControlName="birthCountry"
      placeholder="Type to search countries..."
      enable-validation="true">
    </rlb-autocomplete-country>
  </div>

  <div class="col-md-6">
    <label class="form-label">Phone Prefix</label>
    <rlb-autocomplete-country-dial-code
      formControlName="dialCode"
      open-on-focus
      placeholder="Search code or country..."
      enable-validation="true">
    </rlb-autocomplete-country-dial-code>
  </div>

  <div class="col-md-12">
    <label class="form-label">Preferred Timezone</label>
    <rlb-autocomplete-timezones
      formControlName="timezone"
      open-on-focus
      placeholder="Search timezone (e.g. Rome)..."
      enable-validation="true">
    </rlb-autocomplete-timezones>
  </div>

  <div class="col-12 mt-4 d-flex gap-2">
    <button type="button" class="btn btn-outline-secondary" (click)="patchMockData()">
      Patch Mock Data
    </button>
    <button type="submit" class="btn btn-primary" [disabled]="isSaving || advForm.pending">
      Submit Form
    </button>
  </div>
</form>`;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      country: [''],
    });
    this.advForm = this.fb.group({
      country: [null, Validators.required],
      user: [null, [Validators.required], [this.userAllowedValidator.bind(this)]],
      birthCountry: [null, Validators.required],
      dialCode: [null, Validators.required],
      timezone: [null, Validators.required],
    });
  }

  // Async Validator: Checks if selected user is "Charlie" (Forbidden)
  userAllowedValidator(control: AbstractControl) {
    const val = control.value as AutocompleteItem;
    const isCharlie = val?.text === 'Charlie' || val?.value === '3';
    return of(isCharlie ? { restrictedUser: true } : null).pipe(delay(800));
  }

  submitForm() {
    this.advForm.markAllAsTouched();
    if (this.advForm.valid) {
      this.isSaving = true;
      setTimeout(() => {
        alert('Data Saved: ' + JSON.stringify(this.advForm.value));
        this.isSaving = false;
        this.advForm.reset();
        this.cdr.markForCheck();
      }, 1500);
    } else {
      this.cdr.markForCheck();
    }
  }

  patchMockData() {
    this.advForm.patchValue({
      country: { text: 'Italy', value: 'IT' },
      user: { text: 'Alice', value: '1' },
      birthCountry: { text: 'United States of America', value: 'US' },
      dialCode: { text: 'Italy', value: '+39', data: 'IT' },
      timezone: 'Europe/Rome',
    });
    this.advForm.markAllAsTouched();
  }

  // ── API rows ─────────────────────────────────────────────────────────────

  autocompleteApi: DocApiRow[] = [
    { name: 'autocomplete', type: 'AutocompleteFn', description: 'Function called with the current query string; can return a plain array, a Promise, or an Observable of AutocompleteItem[] (or string[]).', kind: 'Input' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown inside the input when it is empty.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Two-way binding. Disables the input and blocks user interaction.', kind: 'Two-way' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only — text is visible but the user cannot type.', kind: 'Input' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading indicator inside the dropdown while results are being fetched.', kind: 'Input' },
    { name: 'type', type: "'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'", default: "'text'", description: 'HTML input type forwarded to the underlying native input element.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", description: 'Applies Bootstrap form-control-sm or form-control-lg sizing to the input.', kind: 'Input' },
    { name: 'chars-to-search', type: 'number', default: '3', description: 'Minimum number of characters the user must type before the autocomplete function is called.', kind: 'Input' },
    { name: 'max-height', type: 'number', default: '200', description: 'Maximum height (px) of the dropdown suggestion list.', kind: 'Input' },
    { name: 'menu-max-width', type: 'number', description: 'Maximum width (px) of the dropdown suggestion list. Defaults to the input width.', kind: 'Input' },
    { name: 'open-on-focus', type: 'boolean', default: 'false', description: 'When true, the dropdown opens as soon as the field receives focus, even if no text has been typed.', kind: 'Input' },
    { name: 'initial-suggestions', type: 'AutocompleteItem[]', default: '[]', description: 'Pre-loaded items shown in the dropdown when the field is focused and empty. Once the user starts typing the autocomplete function takes over.', kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Applies Bootstrap is-valid / is-invalid classes based on the Angular form-control state.', kind: 'Input' },
    { name: 'id', type: 'string', description: 'Custom HTML id for the input element. An id is auto-generated when not provided.', kind: 'Input' },
    { name: 'selected', type: 'EventEmitter<AutocompleteItem>', description: 'Emitted when the user picks an item from the suggestion list.', kind: 'Output' },
  ];

  autocompleteCountryApi: DocApiRow[] = [
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown inside the input when it is empty.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Two-way binding. Disables the input and blocks user interaction.', kind: 'Two-way' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", description: 'Applies Bootstrap form-control-sm or form-control-lg sizing.', kind: 'Input' },
    { name: 'max-height', type: 'number', default: '200', description: 'Maximum height (px) of the dropdown list.', kind: 'Input' },
    { name: 'menu-max-width', type: 'number', description: 'Maximum width (px) of the dropdown list.', kind: 'Input' },
    { name: 'open-on-focus', type: 'boolean', default: 'false', description: 'Opens the dropdown on focus even when the field is empty.', kind: 'Input' },
    { name: 'enable-flag-icons', type: 'boolean', default: 'false', description: 'When true, shows a flag icon (fi fi-xx CSS class) next to each country name. Requires the flag-icons CSS package.', kind: 'Input' },
    { name: 'detect-locale', type: 'boolean', default: 'false', description: "Promotes the user's locale country to the top of the suggestion list.", kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Applies Bootstrap is-valid / is-invalid classes based on the Angular form-control state.', kind: 'Input' },
    { name: 'id', type: 'string', description: 'Custom HTML id for the input. Auto-generated when not provided.', kind: 'Input' },
    { name: 'selected', type: 'EventEmitter<AutocompleteItem>', description: 'Emitted when the user selects a country. The value is the ISO 3166-1 alpha-2 code.', kind: 'Output' },
  ];

  autocompleteDialCodeApi: DocApiRow[] = [
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown inside the input when it is empty.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Two-way binding. Disables the input and blocks user interaction.', kind: 'Two-way' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only.', kind: 'Input' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a progress bar below the input while an external operation is in progress.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", description: 'Applies Bootstrap form-control-sm or form-control-lg sizing.', kind: 'Input' },
    { name: 'max-height', type: 'number', default: '200', description: 'Maximum height (px) of the dropdown list.', kind: 'Input' },
    { name: 'menu-max-width', type: 'number', description: 'Maximum width (px) of the dropdown list.', kind: 'Input' },
    { name: 'open-on-focus', type: 'boolean', default: 'false', description: 'Opens the dropdown on focus even when the field is empty.', kind: 'Input' },
    { name: 'enable-flag-icons', type: 'boolean', default: 'true', description: 'Shows a flag icon next to each country. Requires the flag-icons CSS package.', kind: 'Input' },
    { name: 'detect-locale', type: 'boolean', default: 'false', description: "Promotes the user's locale country to the top of the list.", kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Applies Bootstrap is-valid / is-invalid classes based on the Angular form-control state.', kind: 'Input' },
    { name: 'id', type: 'string', description: 'Custom HTML id for the input. Auto-generated when not provided.', kind: 'Input' },
    { name: 'selected', type: 'EventEmitter<AutocompleteItem>', description: 'Emitted when the user selects a dial code entry. value holds the dial code (e.g. +39), data holds the ISO country code.', kind: 'Output' },
  ];

  autocompleteTimezonesApi: DocApiRow[] = [
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown inside the input when it is empty.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Two-way binding. Disables the input and blocks user interaction.', kind: 'Two-way' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only.', kind: 'Input' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a progress bar below the input while an external operation is in progress.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", description: 'Applies Bootstrap form-control-sm or form-control-lg sizing.', kind: 'Input' },
    { name: 'max-height', type: 'number', default: '200', description: 'Maximum height (px) of the dropdown list.', kind: 'Input' },
    { name: 'menu-max-width', type: 'number', description: 'Maximum width (px) of the dropdown list.', kind: 'Input' },
    { name: 'open-on-focus', type: 'boolean', default: 'false', description: 'Opens the dropdown on focus even when the field is empty.', kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Applies Bootstrap is-valid / is-invalid classes based on the Angular form-control state.', kind: 'Input' },
    { name: 'id', type: 'string', description: 'Custom HTML id for the input. Auto-generated when not provided.', kind: 'Input' },
    { name: 'selected', type: 'EventEmitter<string>', description: 'Emitted when the user selects a timezone. The payload is the IANA timezone string (e.g. Europe/Rome).', kind: 'Output' },
  ];
}
