---
name: rlb-inputs
description: Expert guidance for @open-rlb/ng-bootstrap form input components (ControlValueAccessor-based: text, select, chips, autocomplete, file, colour, range, formatted numbers and money, rating, one-time code, segmented, tag input, tree select, and the timezone-aware rlb-datepicker, rlb-date-range and rlb-time-picker). Use when building forms or using input components.
---

# RLB ng-Bootstrap Form Inputs Skill

You are an expert in the **@open-rlb/ng-bootstrap** form input components. All inputs implement `ControlValueAccessor` and integrate seamlessly with Angular Reactive Forms and Template-driven forms. They use Angular signals and `ChangeDetectionStrategy.OnPush`. The library requires Angular 22.

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

## rlb-datepicker — One Day

Picks a day. The value is an `IDateTz` at **local midnight of the chosen day, in this control's
timezone** — not a native `<input type="date">`, which ignores the zone and looks different in every
browser.

```html
<rlb-datepicker
  formControlName="birthday"
  timezone="Europe/Rome"
  format="DD/MM/YYYY"
  locale="it"
  [first-day-of-week]="1"
  [min]="today"
  [max]="endOfYear"
  enable-validation
/>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `timezone` | `string` | from `provideRlbDefaults`, else `'UTC'` | The zone the day belongs to. |
| `format` | `string` | `'DD/MM/YYYY'` | Writes the box **and** reads back what is typed into it. |
| `locale` | `string` | `'en'` | Month and weekday names. |
| `first-day-of-week` | `number` | `1` | `0` is Sunday. |
| `min` / `max` | `IDateTz` | — | Days outside are greyed out; a typed one is refused. |
| `clearable` | `boolean` | `true` | Button that empties the value. |
| `show-today` | `boolean` | `true` | Shortcut at the foot of the panel. |
| `readonly` | `boolean` | `false` | Stops typing; the calendar button still opens. |
| `openLabel` / `clearLabel` / `todayLabel` | `string` | English | Accessible names. |

The box is editable. What is typed is parsed with `format`; if it does not parse, or falls outside
`min`/`max`, the box is **put back the way it was** — a box saying one thing while the form holds
another is worse than refusing.

⚠️ `DateTz.parse` only understands an uppercase `YYYY`; given `yyyy` it silently reads the year as
1970. The component normalises the year token before parsing, so either case works here — but
remember it when calling `DateTz.parse` yourself.

## rlb-date-range — From / To

```html
<rlb-date-range
  formControlName="period"
  timezone="Europe/Rome"
  separator=" → "
/>
```

Value is `RlbDateRange` = `{ start?: IDateTz; end?: IDateTz }`. The first click sets the start and
clears any end; the second sets the end and closes. A second click **before** the start is not an
error — it becomes the new start.

Same inputs as `rlb-datepicker` plus `separator` (default `' – '`). Unlike the single picker the box
is **not typeable**: a range on one line has no format that can be read back without guessing where
the middle is.

⚠️ Both are built on CDK Overlay — the app must load `@angular/cdk/overlay-prebuilt.css`, or the
panel lands in the page corner. `ng add` registers it.

### Working with the value

```typescript
import { DateTz, IDateTz } from '@open-rlb/date-tz';

// Never `new Date(...)`. Build bounds with DateTz:
readonly today = DateTz.now('Europe/Rome');
readonly limit = DateTz.parse('2027-12-31', 'YYYY-MM-DD', 'Europe/Rome');

format(d: IDateTz | undefined) {
  return d ? new DateTz(d).toString!('WL DD LM YYYY', 'it') : '';
}
```

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

## rlb-number — Formatted Numbers and Money

Binds a real `number`, shows a formatted one. While the field has focus it holds the plain value
instead: grouping marks inserted under the caret move it and make typing an amount a fight.

```html
<rlb-number formControlName="quantity" />

<!-- The locale decides the symbol, its side and how many decimals the currency keeps. -->
<rlb-number formControlName="price" currency="EUR" locale="it-IT" />

<!-- Units a currency code cannot express. -->
<rlb-number formControlName="weight" suffix="kg" [decimals]="1" />
<rlb-number formControlName="code" prefix="#" align="left" />

<!-- Bounds are applied on blur, never mid-keystroke. -->
<rlb-number formControlName="people" [min]="1" [max]="10" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `locale` | `string` | `'en-GB'` | Decides the grouping separator and the decimal mark. Italian groups from five digits up, so `1234,5` is correct there. |
| `currency` | `string` | — | ISO code. With one the value is written as money in `locale`. |
| `decimals` | `number` | — | Left out, a currency uses its own and anything else allows 0–3. |
| `min` / `max` | `number` | — | Applied when the field is left. Clamping a half-typed number is how `1` becomes `10` under your hands. |
| `prefix` / `suffix` | `string` | — | Text pinned to either side of the box. |
| `align` | `'left' \| 'right'` | `'right'` | Digits under digits down a column of fields. |

Value: `number | null`. An empty box is `null`, never `0`.

---

## rlb-rating — Stars With a Keyboard

```html
<rlb-rating formControlName="score" />
<rlb-rating [max]="10" color="danger" show-value formControlName="score" />
<rlb-rating readonly [ngModel]="4.0" ariaLabel="Average score" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `max` | `number` | `5` | How many stars. |
| `readonly` | `boolean` | `false` | A score being reported, not a control refusing to work: it leaves the tab order and reads as an image, not a disabled slider. |
| `color` | `string` | `'warning'` | Bootstrap colour for the filled stars. |
| `show-value` | `boolean` | `false` | Writes «3 / 5» beside them. |
| `clearable` | `boolean` | `true` | Clicking the star already chosen sets the score to 0. |
| `ariaLabel` | `string` | `'Rating'` | Stars carry no text; without this it announces as an unnamed slider. |

Arrows move the score, Home and End jump to either end. Hovering previews; the preview is dropped
as soon as the keyboard takes over, so the stars never disagree with `aria-valuenow`.

---

## rlb-otp — One-Time Code

One box per character. Pasting the whole code into any box fills the rest, and Backspace in an
empty box steps back into the one before — the two things the hand-written version always misses.

```html
<rlb-otp formControlName="code" (completed)="verify($event)" />
<rlb-otp [length]="4" mask formControlName="pin" />
<rlb-otp alphanumeric [length]="8" formControlName="voucher" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `length` | `number` | `6` | Boxes, and the length of a complete code. |
| `alphanumeric` | `boolean` | `false` | Letters too, and no numeric keypad hint. |
| `mask` | `boolean` | `false` | Password boxes, for a PIN. |
| `ariaLabel` / `slotLabel` | `string` | `'One-time code'` / `'Digit'` | The group and each box («Digit 3»). |
| `completed` | `EventEmitter<string>` | — | Fires when the last box is filled. |

Value: the whole code as one `string`, not one value per box.

---

## rlb-segmented — One of a Few

A real radio group that looks like a button group: one tab stop, arrows to move, `aria-checked` on
each option. A `btn-group` with `[class.active]` bindings — the usual hand-written version — puts
every option in the tab order and says nothing about which one is taken.

```html
<rlb-segmented formControlName="period" label="Period">
  <rlb-segmented-option value="day" label="Day" />
  <rlb-segmented-option value="week" label="Week" />
  <rlb-segmented-option value="month" label="Month" />
</rlb-segmented>

<rlb-segmented formControlName="view" label="Layout" color="secondary" block size="lg">
  <rlb-segmented-option value="list" label="List" icon="bi bi-list-ul" />
  <rlb-segmented-option value="grid" label="Grid" icon="bi bi-grid-3x3-gap" />
  <rlb-segmented-option value="map" label="Map" icon="bi bi-geo-alt" disabled />
</rlb-segmented>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Names the group. Without it the question the options answer is lost. |
| `color` | `'primary' \| 'secondary' \| 'dark'` | `'primary'` | Filled for the taken option, outlined for the rest. |
| `size` | `Size` | — | `sm` / `md` / `lg`. |
| `block` | `boolean` | `false` | Full width, split evenly. |

`rlb-segmented-option`: `value` (any, compared by identity), `label`, `icon`, `disabled`. A disabled
option is skipped by the arrow keys as well as unclickable. The options render nothing themselves —
the group draws the buttons, because only the group can give them one tab stop.

---

## rlb-tag-input — Free-Text Chips

The other half of `rlb-select-chips`: that one can only offer the options it was given, this one
accepts anything the user invents.

```html
<rlb-tag-input formControlName="skills" placeholder="Add a skill…" />

<rlb-tag-input
  formControlName="labels"
  [suggestions]="known"
  [separators]="[',', ' ']"
  [max-tags]="5"
  (rejected)="say($event)"
/>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `suggestions` | `string[]` | `[]` | A datalist — a hint, not a constraint. |
| `separators` | `string[]` | `[',']` | Keys that end a tag, besides Enter. |
| `max-tags` | `number` | — | Past it, adding is refused. |
| `allow-duplicates` | `boolean` | `false` | Off, a repeat is refused rather than silently dropped. |
| `case-sensitive` | `boolean` | `false` | Off, «Angular» and «angular » are the same tag. |
| `rejected` | `EventEmitter<{ value, reason: 'duplicate' \| 'full' }>` | — | Nothing is shown by default: the wording belongs to the form. |

Backspace in an empty box takes back the last tag. Leaving the field commits what is half-typed
rather than dropping it — the usual way this control loses data. Value: `string[]`.

---

## rlb-time-picker — The Hour

The other half of `rlb-datepicker`, on the same timezone-aware value.

```html
<rlb-time-picker formControlName="start" timezone="Europe/Rome" [minute-step]="15" />
<rlb-time-picker formControlName="start" format="hh:mm AA" locale="en" timezone="America/New_York" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `format` | `string` | `'HH:mm'` | date-tz pattern. Also how a typed value is read back. |
| `locale` | `string` | `'en'` | For anything in the format that is a word. |
| `timezone` | `string` | `RLB_DEFAULTS.date.timezone` | Which zone the hour is read and written in. |
| `minute-step` | `number` | `5` | Minutes between the choices in the second column. |
| `clearable` | `boolean` | `true` | A button that empties the field. |

Value: `IDateTz | undefined` — the day it already had, with the chosen hour and minute. A time with
no date is almost never what a form means.

**The trap this component exists to avoid:** the time is built from **local midnight plus minutes**,
never with `set(9, 'hour')`. date-tz's mutators work on the raw UTC timestamp, so `set` lands on
09:00 UTC — 11:00 in Rome in summer, and the wrong day either side of midnight.

---

## rlb-tree-select — A Select Whose Options Are a Tree

`rlb-select` flattens the shape, and a hand-indented `<option>` list only pretends to have one: the
indentation is decoration, the keyboard and the screen reader still see a flat list.

```html
<rlb-tree-select [nodes]="categories" formControlName="category" placeholder="Category" />

<!-- Several at once: tick boxes in the panel, chips in the box, value becomes a string[]. -->
<rlb-tree-select [nodes]="categories" multiple formControlName="categories" />

<!-- Branches are headings, not answers: clicking one only opens it. -->
<rlb-tree-select [nodes]="categories" [branches-selectable]="false" formControlName="leaf" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `RlbTreeNode[]` | `[]` | Same shape as `rlb-tree`. |
| `multiple` | `boolean` | `false` | Tick boxes, chips, and a `string[]` value. |
| `branches-selectable` | `boolean` | `false` | Whether a branch is a possible answer. |
| `searchable` | `boolean` | `true` | A search box that opens the branches leading to a hit. |
| `clearable` | `boolean` | `true` | A button that empties the field. |

Value: **ids**, not nodes — `string` on its own, `string[]` with `multiple`. A form that round-trips
through JSON should not carry whole subtrees with it. An id with no node behind it reads as nothing
chosen rather than being shown as itself.

The panel opens on the branches holding what is already chosen. See `rlb-tree` in the
**rlb-components** skill for the node shape.

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
3. For a day the user picks, reach for `rlb-datepicker` rather than `rlb-input type="date"`; set `timezone` explicitly on either, or set it once with `provideRlbDefaults({ date: { timezone } })`.
4. Use `date-type="date-tz"` when the model uses `@open-rlb/date-tz` DateTz objects.
5. Wrap inputs in a `<div class="mb-3">` with a `<label class="form-label">` for correct Bootstrap spacing.
6. For an amount, use `rlb-number` rather than `rlb-input type="number"`: it binds a real number while showing a formatted one, and leaves the grouping to the locale.
7. For one of three or four choices, `rlb-segmented` is a radio group — a `btn-group` with `[class.active]` is not, however much it looks like one.
