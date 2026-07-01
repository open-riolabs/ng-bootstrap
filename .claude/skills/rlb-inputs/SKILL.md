---
name: rlb-inputs
description: Expert guidance for @open-rlb/ng-bootstrap form input components (ControlValueAccessor-based, integrate with reactive and template-driven forms). Use when building forms or using input components.
---

# RLB ng-Bootstrap Form Inputs Skill

You are an expert in the **@open-rlb/ng-bootstrap** form input components. All inputs implement `ControlValueAccessor` and integrate seamlessly with Angular Reactive Forms and Template-driven forms. They use Angular 18+ signals and `ChangeDetectionStrategy.OnPush`.

## Common Pattern

All inputs share these base inputs:
- `disabled: boolean` — disables the control
- `readonly: boolean` — read-only display
- `size: 'small' | 'large' | undefined` — field size variant
- `id: string` — HTML id (auto-generated if omitted)
- `enable-validation: boolean` — show Bootstrap validation styles (invalid/valid)

All inputs bind via `formControlName` or `[(ngModel)]`.

---

## rlb-input — Text / Number / Date

```html
<!-- Text -->
<rlb-input formControlName="username" placeholder="Enter username" [enable-validation]="true"></rlb-input>

<!-- Number with bounds -->
<rlb-input formControlName="age" type="number" [min]="0" [max]="120" [step]="1"></rlb-input>

<!-- Date (stores as DateTz, timezone-aware) -->
<rlb-input formControlName="birthDate" type="datetime-local" date-type="date-tz" timezone="Europe/Rome"></rlb-input>

<!-- Date stored as ISO string -->
<rlb-input formControlName="startDate" type="datetime-local" date-type="string" timezone="UTC"></rlb-input>

<!-- Password -->
<rlb-input formControlName="password" type="password" [enable-validation]="true"></rlb-input>
```

**Inputs:**
| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | — | Placeholder text |
| `size` | `'small'\|'large'` | — | Field size |
| `min` / `max` / `step` | `number` | — | Number constraints |
| `date-type` | `'date'\|'string'\|'number'\|'date-tz'` | `'date-tz'` | Date value format |
| `timezone` | `string` | `'UTC'` | Timezone for date handling |
| `readonly` | `boolean` | `false` | — |
| `disabled` | `boolean` | `false` | — |
| `enable-validation` | `boolean` | `false` | Show validation state |
| `ext-validation` | `boolean` | `false` | External validation display |

---

## rlb-select — Dropdown Select

```html
<!-- Single select -->
<rlb-select formControlName="country" placeholder="Choose country" [enable-validation]="true">
  <rlb-option value="it">Italy</rlb-option>
  <rlb-option value="de">Germany</rlb-option>
  <rlb-option value="fr">France</rlb-option>
</rlb-select>

<!-- Multiple select -->
<rlb-select formControlName="roles" [multiple]="true" [display]="5">
  <rlb-option value="admin">Admin</rlb-option>
  <rlb-option value="editor">Editor</rlb-option>
  <rlb-option value="viewer">Viewer</rlb-option>
</rlb-select>
```

**Inputs:** `placeholder`, `size`, `disabled`, `readonly`, `multiple`, `display` (visible rows for multiple), `inputId`, `enable-validation`
**Returns:** `string` (single) or `string[]` (multiple)

---

## rlb-checkbox — Checkbox

```html
<rlb-checkbox formControlName="accepted" id="terms">
  I accept the terms and conditions
</rlb-checkbox>

<!-- Indeterminate state -->
<rlb-checkbox formControlName="selectAll" [indeterminate]="someSelected" id="select-all">
  Select all
</rlb-checkbox>
```

**Inputs:** `disabled`, `readonly`, `indeterminate`, `id`
**Returns:** `boolean | undefined`

---

## rlb-switch — Toggle Switch

```html
<rlb-switch formControlName="notifications" id="notif-toggle">
  Enable notifications
</rlb-switch>
```

**Inputs:** `disabled`, `readonly`, `size`, `id`
**Returns:** `boolean`

---

## rlb-radio — Radio Group

```html
<rlb-radio formControlName="gender" id="gender">
  <rlb-option value="m">Male</rlb-option>
  <rlb-option value="f">Female</rlb-option>
  <rlb-option value="o">Other</rlb-option>
</rlb-radio>
```

**Inputs:** `disabled`, `readonly`, `id`
**Returns:** `string`

---

## rlb-select-chips — Multi-select Chips

A compact multi-select for picking several values from a fixed list. Selected values are
rendered as chips **inside** the control and collapse to `(+N others)` once more than
`maxVisible` are chosen, so the selection never spills onto multiple lines. Clicking the
control opens a dropdown that lists every option with a checkbox to toggle it on/off. The
chosen values are stored as a `string[]`.

```html
<rlb-select-chips
  formControlName="languages"
  [options]="['EN', 'IT', 'DE', 'FR', 'ES', 'PT']"
></rlb-select-chips>

<!-- Custom option set + placeholder -->
<rlb-select-chips
  formControlName="languages"
  [options]="['EN', 'IT', 'DE']"
  placeholder="Add language..."
></rlb-select-chips>
```

**Inputs:**
| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `options` | `string[]` | — | Selectable values |
| `placeholder` | `string` | `'Add...'` | Dropdown placeholder |
| `disabled` | `boolean` | `false` | Hides the dropdown and remove buttons |
| `id` | `string` | auto | HTML id |

**Returns:** `string[]` (selected values, in pick order)
**Note:** The dropdown only lists options not already chosen; it disappears once all are selected.

---

## rlb-textarea — Multi-line Text

```html
<rlb-textarea formControlName="notes" placeholder="Add notes..." [rows]="5" [enable-validation]="true"></rlb-textarea>
```

**Inputs:** `disabled`, `readonly`, `placeholder`, `size`, `rows` (default: 3), `id`

---

## rlb-autocomplete — Searchable Input

```html
<rlb-autocomplete
  formControlName="city"
  placeholder="Search city..."
  [autocomplete]="searchCities"
  [chars-to-search]="2"
  [loading]="isSearching"
  [enable-validation]="true"
  (selected)="onCitySelected($event)"
></rlb-autocomplete>
```

```typescript
// Search function — supports sync array, Promise, or Observable
searchCities: AutocompleteFn = (query: string) => {
  return this.cityService.search(query); // returns Observable<AutocompleteItem[]>
};

// AutocompleteItem interface
interface AutocompleteItem {
  label: string;
  value: any;
  icon?: string;
}
```

**Inputs:**
| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `autocomplete` | `AutocompleteFn` | — | Search function (required) |
| `placeholder` | `string` | — | — |
| `chars-to-search` | `number` | `3` | Min chars before search |
| `loading` | `boolean` | `false` | Show loading indicator |
| `max-height` | `number` | `200` | Dropdown max height (px) |
| `type` | `string` | `'text'` | Input type |
| `size` | `'small'\|'large'` | — | — |
| `menu-max-width` | `number\|null` | — | Dropdown max width |
| `input-autocomplete` | `string` | `'off'` | HTML autocomplete attr |
| `enable-validation` | `boolean` | `false` | — |

**Outputs:** `selected: AutocompleteItem`
**Note:** Debounces search by 300ms automatically.

---

## rlb-file — File Upload

```html
<!-- Single file -->
<rlb-file formControlName="document" accept=".pdf,.doc" [enable-validation]="true"></rlb-file>

<!-- Multiple files -->
<rlb-file formControlName="images" [multiple]="true" accept="image/*"></rlb-file>
```

**Inputs:** `disabled`, `readonly`, `multiple`, `size`, `accept`, `id`
**Returns:** `File | File[] | null`

---

## rlb-dnd-file — Drag & Drop File

```html
<rlb-dnd-file formControlName="upload" [multiple]="true" accept="image/*"></rlb-dnd-file>
```

---

## rlb-color — Color Picker

```html
<rlb-color formControlName="themeColor"></rlb-color>
```

**Returns:** `string` (hex color, e.g. `#ff0000`)

---

## rlb-range — Range Slider

```html
<rlb-range formControlName="volume" [min]="0" [max]="100" [step]="5"></rlb-range>
```

---

## rlb-input-group — Input with Addons

```html
<rlb-input-group>
  <span class="input-group-text">@</span>
  <rlb-input formControlName="username"></rlb-input>
</rlb-input-group>

<rlb-input-group>
  <rlb-input formControlName="amount" type="number"></rlb-input>
  <span class="input-group-text">EUR</span>
</rlb-input-group>
```

---

## rlb-input-validation — Validation Messages

```html
<rlb-input-validation [control]="form.get('email')">
  <ng-container *rlbError="'required'">Email is required</ng-container>
  <ng-container *rlbError="'email'">Invalid email format</ng-container>
</rlb-input-validation>
```

---

## Form Field Wrapper (rlb-form-fields)

```html
<rlb-form-field label="Email" [required]="true">
  <rlb-input formControlName="email" type="email" [enable-validation]="true"></rlb-input>
</rlb-form-field>
```

---

## Reactive Form Integration Pattern

```typescript
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Name *</label>
        <rlb-input formControlName="name" [enable-validation]="true"></rlb-input>
      </div>
      <div class="mb-3">
        <label class="form-label">Role</label>
        <rlb-select formControlName="role" [enable-validation]="true">
          <rlb-option value="admin">Admin</rlb-option>
          <rlb-option value="user">User</rlb-option>
        </rlb-select>
      </div>
      <div class="mb-3">
        <rlb-checkbox formControlName="active" id="active-check">Active</rlb-checkbox>
      </div>
      <button rlb-button type="submit" color="primary" [disabled]="form.invalid">Save</button>
    </form>
  `
})
export class MyFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    role: ['user', Validators.required],
    active: [true]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Validators

The library provides custom validators:
```typescript
import { RequiredAutocompleteValidator } from '@open-rlb/ng-bootstrap';

form = this.fb.group({
  city: ['', [Validators.required, RequiredAutocompleteValidator]]
});
```

---

## Best Practices

1. Always set `[enable-validation]="true"` on inputs inside forms with validation.
2. Use `rlb-autocomplete` for any remote search — pass an `Observable`-returning function.
3. For date inputs, always specify `timezone` explicitly; default is `'UTC'`.
4. Use `date-type="date-tz"` when the model uses `@open-rlb/date-tz` DateTz objects.
5. Wrap inputs in a `<div class="mb-3">` with a `<label class="form-label">` for correct Bootstrap spacing.
