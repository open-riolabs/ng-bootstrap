# Migrating from 4.0.3 to 5.0.0

This release moves every floating panel in the library off Bootstrap's JavaScript and onto the
Angular CDK, finishes several APIs that were declared but did nothing, and fixes three selectors
that had never matched anything.

**Read the first section before you upgrade.** Almost nothing here breaks at compile time: the
public surface is intact — no export was removed, no selector changed, no input renamed or
re-aliased. TypeScript will tell you almost nothing. Everything that breaks, breaks quietly at
runtime.

---

## 1. Required: add the CDK overlay stylesheet

**Every application must do this, and nothing will tell you if you forget.**

```jsonc
// angular.json → projects.<app>.architect.build.options.styles
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "node_modules/@angular/cdk/overlay-prebuilt.css",   // ← add this
  "src/styles.scss"
]
```

In 4.0.3 nothing in the library used `@angular/cdk/overlay`. In 5.0.0 twelve files do. That
stylesheet is where `.cdk-overlay-container` and `.cdk-overlay-pane` get their `position`; without
it the container is a static `<div>` at the end of `<body>`, and **every dropdown, tooltip,
popover, datepicker, time picker, tree select, popconfirm and command palette renders unpositioned
at the bottom of the page.**

`ng add` registers it for a new install. It does **not** run again when you bump the version, which
is why this is the first thing on the list.

---

## 2. Dropdowns, tooltips and popovers no longer use Bootstrap's JavaScript

### Events

`show.bs.dropdown`, `shown.bs.dropdown`, `hide.bs.dropdown` and `hidden.bs.dropdown` **no longer
fire** on these elements, and `bootstrap.Dropdown.getInstance(el)` now returns `null`, so
`.show()` / `.hide()` / `.toggle()` on it throw.

`(status-changed)` is unchanged and emits the same four names:

```html
<!-- before -->
<button rlb-dropdown #t>Menu</button>
<!-- el.addEventListener('shown.bs.dropdown', …) -->

<!-- after -->
<button rlb-dropdown (status-changed)="onStatus($event)">Menu</button>
```

One nuance: `shown` and `hidden` now fire **synchronously** when the menu opens and closes, where
Bootstrap fired them after the CSS transition. Code that measured the menu inside `shown` now gets
its geometry before any transition has run.

### The open menu moves out of your component

While a dropdown is open, its `<ul class="dropdown-menu">` is a child of
`body > .cdk-overlay-container`, not of your component. It goes back when the menu closes, so the
breakage is state-dependent and easy to miss in review.

This breaks unit tests that query the fixture, and any ancestor-scoped CSS:

```ts
// before
fixture.nativeElement.querySelector('.dropdown-menu');
// after
document.querySelector('.cdk-overlay-pane .dropdown-menu');
```

```scss
// before — no longer matches while open
.my-panel .dropdown-menu { … }
// after — style the menu itself
.dropdown-menu.my-menu { … }
```

### Markup that is no longer emitted

- `data-bs-toggle="dropdown"` and `data-bs-auto-close` are no longer written on toggles.
- The `dropdown-dynamic` / `dropdown-static` classes are gone.
- An anchor toggle no longer gets `href="#"` — it gets `role="button"` and `tabindex="0"` instead,
  so it no longer jumps the page to the top when clicked.
- A navbar dropdown entry has no `href` attribute at all.
- `[popover]` no longer writes any of its five `data-bs-*` attributes.

Retarget any CSS or E2E selector built on `[data-bs-toggle]` or `a.nav-link[href]`.

### `toggle="dropdown"` is now inert

`ToggleDirective` still accepts `'dropdown'` as a value — it compiles — but no longer writes the
attribute, so a hand-written Bootstrap menu paired with it stops opening. Use the real API:

```html
<!-- before -->
<button rlb-button toggle="dropdown" toggle-target="menu">Actions</button>

<!-- after -->
<rlb-dropdown>
  <button rlb-button rlb-dropdown>Actions</button>
  <ul rlb-dropdown-menu>…</ul>
</rlb-dropdown>
```

### A toggle outside `<rlb-dropdown>` does nothing

`[rlb-dropdown]` now finds its coordinator through injection. Outside an `<rlb-dropdown>` (or an
`<rlb-navbar-dropdown-item>`) there is none, and the click is a no-op. Wrap the toggle and its menu.

---

## 3. Dropdown menu items are real buttons

`li[rlb-dropdown-item]` renders a `<button type="button" class="dropdown-item">` where it used to
render `<span class="dropdown-item " role="button">`.

| Was | Is |
|---|---|
| `span.dropdown-item`, `.dropdown-item[role=button]` | `button.dropdown-item` — target `.dropdown-item` |
| `role="button"` | not emitted; it is a real button |
| `aria-disabled="true|false"` always present | not emitted; the native `disabled` property is used |
| `aria-current="false"` when inactive | absent when inactive, `"true"` when active |
| class `"dropdown-item "` (trailing space) | `"dropdown-item"` |

A real `<button disabled>` no longer fires click events and leaves the tab order, where the old
span still fired click if your CSS allowed it. Stop asserting `aria-disabled="false"` in tests.

---

## 4. `rlb-form-fields` starts empty, and translates differently

**Initial values.** Controls were seeded with their own property name as a string — a field called
`email` started with the value `"email"`. They now start from `field.value` if given, else `false`
for a switch, else `null`.

```ts
// 4.0.3: { email: 'email', active: 'active' }
// 5.0.0: { email: null,    active: false }
```

The consequence that bites: a field with `Validators.required` used to open **valid** (it held a
non-empty string) and now opens **invalid**, which disables the submit button and makes
`submitForm()` a silent no-op. If you relied on the old seeding, set `value` explicitly per field.

**Translations.** The library no longer imports `TranslateModule`, and `@ngx-translate/core` is now
an optional peer dependency. Labels resolve through `RLB_TRANSLATION_SERVICE`, which returns the
key unchanged when nothing is registered — so titles, placeholders and labels render as raw keys
like `common.filter`. Register the bridge:

```ts
providers: [
  { provide: RLB_TRANSLATION_SERVICE, useExisting: TranslateService },
]
```

(If you did not use ngx-translate, this is an improvement: 4.0.3 threw `NullInjectorError`.)

---

## 5. Datatable

**`sortable` and `filtrable` now do something.** Both inputs existed on `rlb-dt-header` in 4.0.3
and rendered nothing at all. They now render a sort button and a filter input. With no change on
your side, a decorative `sortable` becomes a working control — and using it emits
`(current-pageChange)` and `(pagination)` events you never asked for. Remove the attribute where
you did not mean it.

**Every `<th>` gained a wrapper.** `rlb-dt-header` now wraps its projected content in
`<div class="d-flex align-items-center gap-1">`, for every header of every table. `th > span`,
`th > *` and `thead th :first-child` stop matching; use `th .d-flex > …` or a descendant selector.

**Toolbar icons switched from Font Awesome to Bootstrap Icons.** The refresh and create buttons
resolve through `RLB_ICONS` and default to `bi bi-arrow-clockwise` and `bi bi-plus-lg`, where 4.0.3
hard-coded `fa-solid fa-arrows-rotate` and `fa-solid fa-plus`. If your app ships Font Awesome and
not Bootstrap Icons, they render as empty boxes:

```ts
provideRlbIcons({ refresh: 'fa-solid fa-arrows-rotate', add: 'fa-solid fa-plus' })
```

---

## 6. Selectors that never worked, and now do

Three components had the selector `h*[…]`. `h*` is not a CSS selector and matches no element, so
they never attached and never applied their classes. They are fixed, which means the classes now
appear for the first time:

| Attribute | Class it now applies |
|---|---|
| `[rlb-card-title]` | `card-title` — Bootstrap's title margin |
| `[rlb-card-subtitle]` | `card-subtitle mb-2 text-body-secondary` |
| `[rlb-offcanvas-title]` | `offcanvas-title` |

If you had worked around this with your own styling, expect the spacing to change.

---

## 7. Modal and offcanvas

- **A name is generated.** If the dialog has no `aria-label` and no `aria-labelledby` of its own,
  the heading (`.modal-title`, or `[rlb-offcanvas-title]`) is given an id and referenced. Anything
  you wrote yourself wins.
- **Focus restoration moved.** It now happens on `hidden.bs.modal` rather than inside `hide()`, so
  it covers Escape and backdrop clicks too — but it is now asynchronous, after the fade-out. Code
  doing `modalRef.hide(); myElement.focus()` will have focus taken back about 150 ms later.
- **The CDK overlay container is re-parented into an open dialog**, so panels opened inside a modal
  can be reached from the keyboard. `body > .cdk-overlay-container` selectors stop matching while
  a dialog is open.
- Generated ids consume the shared `UniqueIdService` counter, so ids elsewhere (such as the
  sidebar's internal `side-item{N}`) shift depending on how many dialogs were created first. Do not
  build selectors on them.

---

## 8. Compile-time breaks

These are the only things TypeScript will actually stop on.

- **`TableDataQuery.sorting.direction`** narrowed from `string` to the newly exported
  `SortDirection`. Building a query from a route parameter or `localStorage` now fails; import and
  cast to `SortDirection`.
- **Three inputs widened to `| undefined`**: `InputComponent.timezone`, and the datatable's
  `loadMoreLabel` and `actionsLabel` (plus `rlb-dt-actions`'s `label`). Template bindings are
  unaffected; reading the signal in TypeScript now yields `string | undefined`. The rendered
  defaults did not change — they moved into `RLB_DEFAULTS` with identical values.
- **Several constructors became zero-argument**, using `inject()` instead: `SidebarComponent`,
  `ModalDirective`, `OffcanvasComponent`, `ChatItemComponent` and both calendar components.
  `super(a, b)` in a subclass and `new X(...)` in a test both break; construct them through the
  injector.
- **Fifteen new declarations** entered `RlbBootstrapModule`, including `rlb-tree`, `rlb-stat`,
  `rlb-stepper`, `rlb-timeline` and the attribute `[rlb-popconfirm]`. If you hand-rolled a
  component with one of those selectors you will get "multiple components match node" at build.

---

## 9. Behaviour worth knowing about

- **Tooltips open on keyboard focus**, not only hover, are tied to their trigger with
  `aria-describedby`, and close on Escape.
- **Popovers dismiss on an outside click** and on Escape, and write `aria-expanded` on the trigger.
  Bootstrap's popover stayed open until you clicked the trigger again.
- **An open dropdown consumes keys globally.** Escape, the arrows, Home and End are handled in the
  capture phase on `window` and stopped, so your own handler on a parent or on `document` will not
  see them while a menu is open. Tab closes the menu.
- **Dropdowns, tooltips and popovers keep Bootstrap's classes** — `.dropdown-menu`, `.tooltip`,
  `.tooltip-inner`, `.popover-header`, `.popover-body`, the arrow and `data-popper-placement` — so
  theme overrides survive. Only direct-child selectors such as `body > .tooltip` break, because
  there is now an `<rlb-hint-panel>` host and a `.cdk-overlay-pane` in between.
- **`rlb-dropdown` and `rlb-dropdown-container` project more than they used to.** Children that
  matched no slot were silently dropped and now render; a plain `<li>`, or an `@for` arriving as an
  `ng-container`, used to vanish from a menu and now appears. Check for strays.
- **The sidebar no longer writes to the DOM by id.** `SidebarService.setCollapsed()` used to toggle
  a `collapsed` class on `#sidebar` and an `expanded` class on `.rlb-content`; both are host
  bindings now. No library stylesheet ever defined `.rlb-content.expanded`, so a rule of your own
  keyed on it stops firing. And if you put `class="rlb-sidebar" id="sidebar"` on a wrapper `<div>`
  rather than on `<rlb-sidebar>`, the class now lands on the component and the sidebar stops
  collapsing.
- `PopoverDirective.bsInit`, a public static, was removed.

---

## What is new

Nothing below breaks anything; it is here so you know what you have.

**Components** — `rlb-tree` and `rlb-tree-select`, `rlb-split-button`, `rlb-avatar-group`,
`rlb-stat`, `rlb-timeline`, `rlb-virtual-list`, `rlb-command-palette`, `rlb-stepper`,
`rlb-empty-state`, `[rlb-popconfirm]`, `rlb-theme-toggle`.

**Inputs** — `rlb-number` (formatted amounts and money), `rlb-rating`, `rlb-otp`, `rlb-segmented`,
`rlb-tag-input`, `rlb-datepicker`, `rlb-date-range`, `rlb-time-picker`.

**Datatable** — sorting, per-column filtering, row selection, hideable columns, a sticky header and
CSV export, all emitted through `(data-query)`.

**Configuration** — `provideRlbIcons()`, `provideRlbDefaults()`, `provideRlbTheme()` and
`RLB_TRANSLATION_SERVICE`.

**Keyboard and screen readers** — dropdown menus, segmented groups, ratings, trees and the command
palette are all operable from the keyboard, and icon-only controls carry names.

**A `fragment` input** on `rlb-sidebar-item` and `li[rlb-dropdown-item]`, for linking to a section
of a page.
