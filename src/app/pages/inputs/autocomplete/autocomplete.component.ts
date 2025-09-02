import { Component } from '@angular/core';
import { AutocompleteFn, AutocompleteItem } from "@lbdsh/lib-ng-bootstrap";
import { delay, Observable, of } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    standalone: false
})
export class AutocompletesComponent {

  html: string = `<rlb-autocomplete></rlb-autocomplete>`;
  
  /*REACTIVE FORMS BEGIN*/
  form!: FormGroup;
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
  };
  
  /*REACTIVE FORMS END*/
  
  /*STATIC SOURCE BEGIN*/
  
  cities = ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'];
  
  searchCities = (q?: string) => {
    if (!q) return this.cities;
    return this.cities.filter(c =>
      c.toLowerCase().includes(q.toLowerCase())
    );
  };
  
  onCitySelect(item: any) {
    console.log('Selected city:', item);
  }
  
  /*STATIC SOURCE END*/
  
  /*PROMISE SOURCE BEGIN*/
  products: AutocompleteItem[] = [
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
  }
  
  /*PROMISE SOURCE END*/
  
  /*OBSERVABLE SOURCE BEGIN*/
  
  users: AutocompleteItem[] = [
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
  }
  
  /*OBSERVABLE SOURCE END*/
}
