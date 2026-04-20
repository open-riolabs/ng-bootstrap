import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutocompleteFn, AutocompleteItem } from '@open-rlb/ng-bootstrap';
import { delay, Observable, of } from 'rxjs';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  imports: [SHARED_IMPORTS],
})
export class AutocompletesComponent {
  advForm: FormGroup;
  isSaving = false;
  private cdr = inject(ChangeDetectorRef);

  /*REACTIVE FORMS BEGIN*/

  reactiveFormsHtml: string = `<form [formGroup]="form">
 <rlb-autocomplete
  formControlName="country"
  [placeholder]="'Search country...'"
  [autocomplete]="searchCountries">
 </rlb-autocomplete>
</form>
<p>Form value: {{ form.value | json }}</p>`;

  reactiveFormsTs: string = `form!: FormGroup;
  countries = ['Italy', 'Spain', 'Germany', 'France', 'Portugal'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      country: ['']
    });
  }

  searchCountries: AutocompleteFn = (q?: string) => {
    if (!q) return this.countries;
    return this.countries.filter(c =>
      c.toLowerCase().includes(q.toLowerCase())
    );
  };`;

  form!: FormGroup;
  countries = ['Italy', 'Spain', 'Germany', 'France', 'Portugal'];

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

  searchCountries: AutocompleteFn = (q?: string) => {
    if (!q) return this.countries;
    return this.countries.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  };

  /*REACTIVE FORMS END*/

  /*STATIC SOURCE BEGIN*/
  html: string = `<rlb-autocomplete
 [placeholder]="'Search city...'"
 [autocomplete]="searchCities"
 (selected)="onCitySelect($event)">
</rlb-autocomplete>`;

  ts: string = `  cities = ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'];

  searchCities = (q?: string) => {
    if (!q) return this.cities;
    return this.cities.filter(c =>
      c.toLowerCase().includes(q.toLowerCase())
    );
  };

  onCitySelect(item: AutocompleteItem) {
    console.log('Selected city:', item);
  }`;

  cities = ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'];

  searchCities = (q?: string) => {
    if (!q) return this.cities;
    return this.cities.filter(c => c.toLowerCase().includes(q.toLowerCase()));
  };

  onCitySelect(item: AutocompleteItem) {
    console.log('Selected city:', item);
  }

  /*STATIC SOURCE END*/

  /*PROMISE SOURCE BEGIN*/
  promiseHtml: string = `<rlb-autocomplete
 [placeholder]="'Search product...'"
 [autocomplete]="searchProducts"
 (selected)="onProductSelect($event)">
</rlb-autocomplete>`;

  promiseTs: string = `  products: AutocompleteItem[] = [
    { text: 'Laptop', value: 'p1' },
    { text: 'Phone', value: 'p2' },
    { text: 'Headphones', value: 'p3' }
  ];

  searchProducts: AutocompleteFn = (q?: string) => {
    return new Promise<AutocompleteItem[]>(resolve => {
      setTimeout(() => {
        if (!q) {
          resolve(this.products);
        } else {
          resolve(
            this.products.filter(
              p => typeof p !== 'string' && p.text.toLowerCase().includes(q.toLowerCase())
            )
          );
        }
      }, 800);
    });
  };

  onProductSelect(item: AutocompleteItem) {
    console.log('Selected product:', item);
  }`;

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

  /*PROMISE SOURCE END*/

  /*OBSERVABLE SOURCE BEGIN*/

  observableHtml: string = `<rlb-autocomplete
 [placeholder]="'Search user...'"
 [autocomplete]="searchUsers"
 [chars-to-search]="2"
 (selected)="onUserSelect($event)">
</rlb-autocomplete>`;

  observableTs: string = `users: AutocompleteItem[] = [
    { text: 'Alice', value: '1' },
    { text: 'Bob', value: '2' },
    { text: 'Charlie', value: '3' }
  ];

  searchUsers: AutocompleteFn = (q?: string): Observable<AutocompleteItem[]> => {
    const filtered = !q
      ? this.users
      : this.users.filter(u => typeof u !== 'string' && u.text.toLowerCase().includes(q.toLowerCase()));

    return of(filtered).pipe(delay(500));
  };

  onUserSelect(item: AutocompleteItem) {
    console.log('Selected user:', item);
  }`;

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

  /*OBSERVABLE SOURCE END*/

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
        this.cdr.markForCheck(); // Required for zoneless setTimeout
      }, 1500);
    } else {
      this.cdr.markForCheck();
    }
  }

  patchMockData() {
    // Simulating API response patching complex objects
    this.advForm.patchValue({
      country: { text: 'Italy', value: 'IT' },
      user: { text: 'Alice', value: '1' },
      birthCountry: { text: 'United States of America', value: 'US' },
      dialCode: { text: 'Italy', value: '+39', data: 'IT' },
      timezone: 'Europe/Rome',
    });

    this.advForm.markAllAsTouched();
  }
}
