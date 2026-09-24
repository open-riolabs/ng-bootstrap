---
name: rlb-components
description: Expert guidance for the @open-rlb/ng-bootstrap Angular component library (buttons, split buttons, cards, dropdowns, toasts, loaders, badges, avatars and avatar groups, trees, stepper/wizard, empty states, popconfirm, theme toggle, stat tiles, timelines, virtual lists, command palette), and its configuration tokens for icons, dark mode, global defaults and translations. Built on Angular signals, OnPush and Bootstrap 5. Use when using or composing these UI components, or when configuring the library.
---

# RLB ng-Bootstrap Components Skill

You are an expert in the **@open-rlb/ng-bootstrap** Angular component library. All components use Angular signals, `ChangeDetectionStrategy.OnPush`, and Bootstrap 5. The library requires Angular 22. Import via `RlbBootstrapModule` or individual standalone imports.

## Shared Types

```typescript
type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';
type TextAlignment = 'left' | 'center' | 'right';
```

---

## Buttons

```html
<!-- Basic button -->
<button
  rlb-button
  color="primary"
  size="md"
>
  Click me
</button>
<button
  rlb-button
  color="danger"
  outline
>
  Delete
</button>
<button
  rlb-button
  color="secondary"
  [disabled]="true"
>
  Disabled
</button>
<a
  rlb-button
  color="info"
  isLink
>
  Link
</a>

<!-- Button group -->
<rlb-button-group
  orientation="horizontal"
  size="md"
>
  <button
    rlb-button
    color="primary"
  >
    A
  </button>
  <button
    rlb-button
    color="primary"
  >
    B
  </button>
</rlb-button-group>

<!-- FAB (Floating Action Button) -->
<rlb-fab
  color="primary"
  size="md"
  position="br"
>
  <i class="bi bi-plus"></i>
</rlb-fab>
```

**Button inputs:** `color`, `size`, `disabled`, `outline`, `isLink`
**FAB inputs:** `color`, `size`, `disabled`, `outline`, `position` ('br'|'bl'|'tr'|'tl')

---

### Split button (rlb-split-button)

The action people take, with the ones they sometimes take behind it. Three equal buttons make the
reader choose before they have read them.

```html
<rlb-split-button color="primary" (action)="save()" menuLabel="More save options">
  Save
  <li><a class="dropdown-item" (click)="saveAndClose()">Save and close</a></li>
  <li><a class="dropdown-item" (click)="saveDraft()">Save as draft</a></li>
</rlb-split-button>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `color` / `size` / `outline` / `disabled` | | | As `rlb-button`. |
| `icon` | `string` | — | Drawn before the label of the main button. |
| `menu-disabled` | `boolean` | `false` | Disables only the arrow. |
| `menu-align` | `'start' \| 'end'` | `'start'` | `end` for a button at the right-hand edge of a toolbar. |
| `menuLabel` | `string` | `'More actions'` | The arrow has no text of its own: without this it announces as «button» beside another button that does have a name. |
| `action` | `EventEmitter<MouseEvent>` | — | The main button. Menu items emit their own. |

---

## Alerts

```html
<rlb-alert color="success">Operation successful.</rlb-alert>
<rlb-alert
  color="danger"
  [dismissible]="true"
  (dismissed)="onDismiss()"
>
  An error occurred!
</rlb-alert>
```

**Inputs:** `color`, `dismissible` (boolean), `class`
**Outputs:** `dismissed`

---

## Badges

```html
<span
  rlb-badge
  color="primary"
>
  New
</span>
<span
  rlb-badge
  color="success"
  [pill]="true"
>
  Active
</span>
<span
  rlb-badge
  color="danger"
  [border]="true"
>
  3
</span>
<span
  rlb-badge
  color="warning"
  [soft]="true"
>
  Pending
</span>
```

**Inputs:** `color`, `pill`, `border`, `soft`, `hidden-text`, `class`, `badge-text-color`

`soft` (default `false`) swaps the solid fill for a tinted surface with emphasis text. It is
theme-aware (re-derives under `[data-bs-theme]`) and AA-legible in both light and dark, unlike the
solid variants whose fixed text colour fails on several colours. Also on the `[badge]` directive as
`badge-soft` — ignored for `badge-dot`, which stays solid.

---

## Avatar

```html
<rlb-avatar
  [size]="48"
  shape="circle"
  src="/assets/user.png"
></rlb-avatar>
<rlb-avatar
  [size]="40"
  shape="round"
>
  AB
</rlb-avatar>
<rlb-avatar
  [size]="56"
  shape="square"
  src="/assets/logo.png"
></rlb-avatar>
```

**Inputs:** `size` (px number), `shape` ('circle'|'round'|'square'), `src`, `class`

### Avatar group (rlb-avatar-group)

Who is on this: the avatars overlap, and whoever is left over is counted.

```html
<rlb-avatar-group [extra]="team().length - 3" [size]="40" ariaLabel="On this ticket">
  @for (member of team().slice(0, 3); track member.id) {
    <rlb-avatar [src]="member.photo" [size]="40" />
  }
</rlb-avatar-group>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `extra` | `number` | `0` | How many more there are beyond the avatars projected here. The group **counts, it does not hide**: the caller writes the `@for` and so already decides how many to draw. |
| `size` | `number` | `50` | Diameter of the «+N» badge; match it to the avatars. |
| `overlap` | `number` | `12` | How far each sits over the one before, in px. |
| `ariaLabel` | `string` | — | Names the pile. |
| `overflowLabel` | `(count: number) => string` | `` count => `${count} more` `` | A function, because a count glued to a word does not translate. |

---

## Cards

```html
<rlb-card
  align="left"
  background="light"
>
  <rlb-card-header>Card Title</rlb-card-header>
  <rlb-card-image src="/img.png"></rlb-card-image>
  <rlb-card-body>
    <rlb-card-title>Title</rlb-card-title>
    <rlb-card-subtitle>Subtitle</rlb-card-subtitle>
    <rlb-card-text>Body text here.</rlb-card-text>
    <rlb-card-link href="/more">Read more</rlb-card-link>
  </rlb-card-body>
  <rlb-card-footer>Footer</rlb-card-footer>
</rlb-card>
```

**Card inputs:** `align`, `overlay`, `background` (Color), `border` (Color)
**Sub-components:** `rlb-card-body`, `rlb-card-header`, `rlb-card-footer`, `rlb-card-image`, `rlb-card-title`, `rlb-card-subtitle`, `rlb-card-text`, `rlb-card-link`

---

## Accordion

```html
<rlb-accordion
  [flush]="false"
  [always-open]="false"
  [card-style]="true"
>
  <rlb-accordion-item>
    <ng-template rlb-accordion-header>Section 1</ng-template>
    <ng-template rlb-accordion-body>Content 1</ng-template>
  </rlb-accordion-item>
  <rlb-accordion-item>
    <ng-template rlb-accordion-header>Section 2</ng-template>
    <ng-template rlb-accordion-body>Content 2</ng-template>
  </rlb-accordion-item>
</rlb-accordion>
```

**Inputs:** `flush`, `always-open`, `card-style`, `id`

---

## Tabs

`rlb-tabs` holds the tab strip; `rlb-tab-content` holds the panes. Each `rlb-tab`'s `target`
must equal its `rlb-tab-pane`'s `id`. Seed the initially-open tab/pane with `active`. The tab
label is projected content, so you can put a `rlb-badge` count inside it.

```html
<rlb-tabs view="tab">
  <rlb-tab
    target="home"
    active
  >
    Home
  </rlb-tab>
  <rlb-tab target="profile">
    Profile
    <span
      rlb-badge
      color="secondary"
      [pill]="true"
    >
      3
    </span>
  </rlb-tab>
  <rlb-tab
    target="messages"
    [disabled]="true"
  >
    Messages
  </rlb-tab>
</rlb-tabs>

<rlb-tab-content>
  <rlb-tab-pane
    id="home"
    active
  >
    Home content.
  </rlb-tab-pane>
  <rlb-tab-pane id="profile">Profile content.</rlb-tab-pane>
  <rlb-tab-pane id="messages">Messages content.</rlb-tab-pane>
</rlb-tab-content>
```

**`rlb-tabs` inputs:** `view` ('tab'|'pills'|'underline'|'none'), `vertical`, `fill` ('fill'|'justified'), `horizontal-alignment` ('center'|'end'), `id`, `class`
**`rlb-tab` inputs:** `target` (**required** — matches a pane `id`), `active`, `disabled`, `class`
**`rlb-tab-pane` inputs:** `id` (**required**), `active`, `fade`

> Switching is driven by Bootstrap's tab plugin — there is **no select/change output**, and
> `active` only seeds the initial tab. For router-controlled or deep-linked tabs (active state
> lives in the URL), drive the markup yourself with plain `nav-tabs` instead.

---

## Carousel

```html
<rlb-carousel
  autoplay="auto"
  [interval]="3000"
  pause="hover"
  [wrap]="true"
  [hide-indicators]="false"
  [hide-controls]="false"
  [(current-slide)]="currentSlide"
  (slid)="onSlid($event)"
>
  <rlb-carousel-slide active>
    Slide 1
    <rlb-carousel-caption>
      <h5>First slide</h5>
    </rlb-carousel-caption>
  </rlb-carousel-slide>
  <rlb-carousel-slide>Slide 2</rlb-carousel-slide>
</rlb-carousel>
```

**Children:** `rlb-carousel-slide` (input `active`, `id`), `rlb-carousel-caption`
**Inputs:** `autoplay` (`'auto' | 'manual' | 'none'`), `interval`, `pause`, `wrap`, `cross-fade`, `hide-indicators`, `hide-controls`, `no-touch`, `keyboard`, `id`
**Two-way:** `current-slide`
**Outputs:** `slid`, `slide`, `slide-count`
**Methods (via viewChild):** `prev()`, `next()`, `to(index)`, `pause()`, `cycle()`

### Wizard pattern (multi-step form)

There is no separate wizard component — a wizard **is** a carousel used as a controlled stepper.
Disable autoplay/controls/indicators/touch, drive `current-slide` from your own Back / Next buttons,
and gate `Next` on the current step's validity. Often embedded in a modal (see the `rlb-modals` skill).

```html
<div [formGroup]="form">
  <rlb-carousel
    autoplay="none"
    no-touch
    hide-controls
    hide-indicators
    [current-slide]="page()"
    (current-slideChange)="page.set($event)"
    (slide-count)="count.set($event)"
    id="wizard"
  >
    <rlb-carousel-slide active>
      <div formGroupName="account"><!-- step 1 fields --></div>
    </rlb-carousel-slide>
    <rlb-carousel-slide>
      <div formGroupName="profile"><!-- step 2 fields --></div>
    </rlb-carousel-slide>
  </rlb-carousel>
</div>

<button
  rlb-button
  outline
  [disabled]="page() === 0"
  (click)="prev()"
>
  Back
</button>
@if (page() < count() - 1) {
<button
  rlb-button
  color="primary"
  [disabled]="currentStepInvalid()"
  (click)="next()"
>
  Next
</button>
} @else {
<button
  rlb-button
  color="success"
  [disabled]="form.invalid"
  (click)="onFinish()"
>
  Finish
</button>
}
```

```typescript
readonly page = signal(0);   // bound one-way to [current-slide]
readonly count = signal(0);  // set from (slide-count)
readonly groupNames = ['account', 'profile'];

// Validate one step at a time to gate the Next button.
currentStepInvalid(): boolean {
  return !!this.form.get(this.groupNames[this.page()])?.invalid;
}
prev() { this.page.update(p => Math.max(0, p - 1)); }
next() { this.page.update(p => Math.min(this.count() - 1, p + 1)); }
```

> Key points: bind `[current-slide]` **one-way** and update the signal yourself (don't use `[(...)]`
> two-way when you drive navigation manually); use `(slide-count)` to detect the last step; keep each
> step in its own nested `FormGroup` so `currentStepInvalid()` can validate steps independently.

---

## Breadcrumb

```html
<rlb-breadcrumb
  divider="/"
  [items]="[
    { id: '1', label: 'Home', link: '/' },
    { id: '2', label: 'Products', link: '/products' },
    { id: '3', label: 'Detail' }
  ]"
/>
```

**Inputs:** `divider`, `items: BreadcrumbItem[]`, `cssClasses`
**BreadcrumbItem:** `{ id: string; label: string; link?: string }`

---

## Dropdown

```html
<rlb-dropdown direction="down">
  <button rlb-button color="primary" rlb-dropdown>Actions</button>
  <ul rlb-dropdown-menu placement="right">
    <li rlb-dropdown-item header>Section</li>
    <li rlb-dropdown-item (click)="rename()">Rename</li>
    <li rlb-dropdown-item disabled>Move</li>
    <li rlb-dropdown-item divider></li>
    <li rlb-dropdown-item link="/settings">Settings</li>
  </ul>
</rlb-dropdown>

<!-- Arbitrary content instead of a list. -->
<rlb-dropdown>
  <button rlb-button rlb-dropdown [offset]="[0, 8]" auto-close="outside">Filters</button>
  <rlb-dropdown-container>
    <div class="p-3">…anything…</div>
  </rlb-dropdown-container>
</rlb-dropdown>
```

| Element | Input | Notes |
|---|---|---|
| `rlb-dropdown` | `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'up-center' \| 'down-center'`. |
| `[rlb-dropdown]` | `offset` | `[x, y]` px. |
| | `auto-close` | `'default' \| 'inside' \| 'outside' \| 'manual'`. Use `outside` for a menu of checkboxes: `default` closes on the first tick. |
| | `anchor` | `'self' \| 'parent'`. `parent` lines the menu up with the box around the toggle — what a split button needs. |
| | `(status-changed)` | `'show' \| 'shown' \| 'hide' \| 'hidden'`. |
| `rlb-dropdown-container`, `ul[rlb-dropdown-menu]` | `placement`, `placement-sm…xxl` | `'left' \| 'right'`, per breakpoint. |
| `li[rlb-dropdown-item]` | `active`, `disabled`, `header`, `divider`, `link`, `text-wrap` | `link` renders an anchor with `routerLink`. |

**It runs on the CDK Overlay, not on Bootstrap's dropdown plugin.** What that changes:

- The menu is rendered at the end of the body, so an ancestor with `overflow: hidden` — a scrolling
  panel, a table cell — no longer clips it. The old fix was `data-bs-popper-config`, per call site.
- It flips instead of overflowing: a menu with no room below opens upwards.
- The keyboard works. Down opens with the first item focused, the arrows walk the enabled items and
  wrap, Home and End jump, Escape closes and hands focus back. An action item is a real `<button>`.
- `rlb-navbar-dropdown-item`, `rlb-split-button`, `rlb-dt-actions` and the datatable's column menu
  all ride the same overlay; nothing in the library sets `data-bs-toggle="dropdown"` any more.

⚠️ Because of that, `@angular/cdk/overlay-prebuilt.css` is now needed by **any** app that opens a
dropdown, not only by the datepicker and the popconfirm. `ng add` registers it; without it the
menu opens in the corner of the page.

Bootstrap's plugin is still loaded for modals, collapse and the rest, and it still binds a
**capture-phase** handler on the document for anything matching `.dropdown-menu`. Keys the menu
handles are stopped before they reach it — without that it looks for a `[data-bs-toggle]` that no
longer exists and throws. Worth knowing if you add keys of your own to a menu.

---

## Pagination

```html
<rlb-pagination
  size="md"
  alignment="center"
>
  <rlb-pagination-item [active]="true">1</rlb-pagination-item>
  <rlb-pagination-item>2</rlb-pagination-item>
</rlb-pagination>
```

**Inputs:** `size`, `alignment` ('start'|'center'|'end'), `class`

---

## Navigation (Navbar + Sidebar)

```html
<rlb-navbar
  color="primary"
  [dark]="true"
  expand="lg"
  placement="fixed-top"
>
  <a
    rlb-navbar-brand
    href="/"
  >
    MyApp
  </a>
  <rlb-navbar-items>
    <a
      class="nav-link"
      routerLink="/home"
    >
      Home
    </a>
  </rlb-navbar-items>
</rlb-navbar>

<rlb-sidebar
  [dark]="true"
  [rounded]="false"
>
  <rlb-sidebar-item routerLink="/dashboard">Dashboard</rlb-sidebar-item>
  <rlb-sidebar-item routerLink="/settings">Settings</rlb-sidebar-item>
</rlb-sidebar>
```

**Navbar inputs:** `dark`, `color`, `placement`, `expand`, `show-sidebar-toggler`, `enable-dropdown-toggler`, `class`
**Sidebar inputs:** `dark`, `rounded`

---

## Loaders

```html
<!-- Spinner -->
<rlb-spinner
  style="border"
  color="primary"
  size="md"
></rlb-spinner>
<rlb-spinner
  style="grow"
  color="success"
  size="sm"
></rlb-spinner>

<!-- Progress bar -->
<rlb-progress
  [value]="65"
  [max]="100"
  color="primary"
  [striped]="true"
  [animated]="true"
  [showValue]="true"
></rlb-progress>

<!-- Infinite progress -->
<rlb-progress
  [infinite]="true"
  color="info"
></rlb-progress>
```

**Spinner inputs:** `style` ('border'|'grow'), `color`, `size`
**Progress inputs:** `value`, `max`, `min`, `height`, `animated`, `striped`, `infinite`, `showValue`, `color`, `text-color`, `aria-label`

---

## Placeholders (skeletons)

Skeleton loading state for content that hasn't loaded yet. Use `rlb-placeholder-text` for
quick multi-line text blocks, or `rlb-placeholder` + `rlb-placeholder-line` for custom layouts
(cards, stat rows). Toggle with an `@if (loading())` block — render the skeleton while loading,
the real content otherwise.

```html
<!-- Quick multi-line text skeleton -->
<rlb-placeholder-text
  [lines]="3"
  animation="glow"
/>

<!-- Per-line widths: pass a string[] (falls back to 100% past the end) -->
<rlb-placeholder-text
  [lines]="3"
  [width]="['80%', '100%', '60%']"
  animation="glow"
/>

<!-- Custom layout: container + individual lines for full control -->
<rlb-placeholder animation="glow">
  <rlb-placeholder-line
    width="40%"
    height="28px"
  />
  <rlb-placeholder-line width="100%" />
  <rlb-placeholder-line
    width="80%"
    color="primary"
    size="sm"
  />
  <rlb-placeholder-line
    width="60%"
    [rounded]="false"
  />
</rlb-placeholder>

<!-- Skeleton-style any element via the directive -->
<span
  rlb-placeholder
  placeholder-animation="glow"
  style="width: 6rem"
>
  &nbsp;
</span>
```

Common pattern — a fixed number of skeleton rows (e.g. matching a table page size):

```html
<rlb-placeholder animation="glow">
  @for (line of [].constructor(pageSize()); track $index) {
  <rlb-placeholder-line width="100%" />
  }
</rlb-placeholder>
```

**`rlb-placeholder`** (container, applies the animation to children)
Inputs: `animation` ('glow' | 'wave' | 'none', default 'none')

**`rlb-placeholder-line`** (one skeleton bar; renders as a block with bottom margin)
Inputs: `width` (CSS string, default '100%'), `height` (CSS string, default '1.5rem'),
`size` ('xs' | 'sm' | 'md' | 'lg', default 'md'), `color` (Bootstrap bg name, default 'secondary'),
`rounded` (boolean, default `true`)

**`rlb-placeholder-text`** (convenience: N lines in a `rlb-placeholder` for you)
Inputs: `lines` (default 1), `width` (string **or** string[] for per-line widths, default '100%'),
`animation`, `size`, `color`, `height`, `rounded` — same meaning/defaults as above

**`[rlb-placeholder]`** (directive to skeletonize any element)
Inputs (aliased): `placeholder-color` (Color), `placeholder-size` ('xs'|'sm'|'md'|'lg'),
`placeholder-animation` ('glow' | 'fade' | 'none')

> Boolean inputs like `rounded` need a binding: `[rounded]="false"`, not a bare `rounded` attribute.

---

## Toast

```typescript
// In component
constructor(private toast: ToastService) {}

showSuccess() {
  this.toast.openToast('my-toast', 'success-toast').subscribe();
}
```

---

## Tooltip & popover

⚠️ The selectors are `[tooltip]` and `[popover]`, not `rlb-tooltip`. Earlier versions of this
document said otherwise; they were wrong.

```html
<button rlb-button tooltip="Helpful tip" tooltip-placement="top">Hover me</button>

<!-- Markup instead of text, sanitised by Angular. -->
<button rlb-button tooltip="<strong>Bold</strong> tip" tooltip-html>HTML</button>

<!-- ALWAYS bind [popover]: a static popover="..." is also the NATIVE HTML popover attribute,
     which puts the host into the browser's own manual popover state and hides it. -->
<button rlb-button [popover]="'The body'" popover-title="A title" popover-placement="bottom">
  Click me
</button>
```

| Attribute | Input | Notes |
|---|---|---|
| `[tooltip]` | `tooltip` | The text. `null` turns it off, and takes an open one away with it. Changing it while it is up rewrites it in place. |
| | `tooltip-placement` | `'top' \| 'bottom' \| 'left' \| 'right'`. A preference: with no room there it takes the opposite side. |
| | `tooltip-class`, `tooltip-html` | Extra classes on the panel; `tooltip-html` renders the value as markup. |
| `[popover]` | `popover` | The body, always written as text. |
| | `popover-title` | Header. |
| | `popover-placement`, `popover-class` | As above. |

**Both run on the CDK Overlay, not on Bootstrap's tooltip/popover plugins.** What that changes:

- Neither is clipped by an ancestor with `overflow: hidden`, and both flip rather than running off
  the window. The arrow follows: `data-popper-placement` on the panel reports the *resolved* side,
  and the arrow is re-centred on the trigger even after the overlay has been pushed sideways.
- The tooltip opens on **focus** as well as hover, ties itself to the trigger with
  `aria-describedby` so a screen reader reads it, and closes on Escape.
- The popover writes `aria-expanded` on its trigger, and closes on an outside click or Escape.
- `@angular/cdk/overlay-prebuilt.css` is required, as for every other panel here.

---

## Collapse & Offcanvas

```html
<!-- Collapse -->
<button
  rlb-button
  rlb-collapse-toggle
  target="myCollapse"
>
  Toggle
</button>
<rlb-collapse id="myCollapse">Hidden content</rlb-collapse>

<!-- Offcanvas -->
<button
  rlb-button
  rlb-offcanvas-toggle
  target="myPanel"
>
  Open Panel
</button>
<rlb-offcanvas
  id="myPanel"
  placement="start"
>
  Panel content
</rlb-offcanvas>
```

---

## Stepper (rlb-stepper + rlb-step)

A form split into steps. A step's content stays in the DOM while another step is showing, merely
hidden — a wizard is usually one form in three parts, and tearing down step 1 to show step 2 would
throw away everything typed into it.

```html
<rlb-stepper
  linear
  [(selectedIndex)]="step"
  (finish)="submit()"
  #stepper
>
  <rlb-step label="Account" [step-control]="form.controls.account">
    <!-- the fields of step one -->
  </rlb-step>
  <rlb-step label="Profile" [step-control]="form.controls.profile" hint="Nearly there">
    ...
  </rlb-step>
  <rlb-step label="Confirm" optional>
    ...
  </rlb-step>
</rlb-stepper>

<button rlb-button outline [disabled]="stepper.isFirst()" (click)="stepper.previous()">Back</button>
<button rlb-button (click)="stepper.next()">{{ stepper.isLast() ? 'Finish' : 'Next' }}</button>
```

**rlb-stepper**

| Input / member | Type | Default | Notes |
|---|---|---|---|
| `selectedIndex` | `number` | `0` | Two-way. |
| `linear` | `boolean` | `false` | Refuses to move past a step that is not passable, and to jump ahead over one. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `optionalLabel` | `string` | `'Optional'` | Shown under an optional step that has no `hint`. |
| `(finish)` | `void` | | The user asked to finish from the last step. |
| `next()` | `boolean` | | Moves on, or returns `false` **and marks the step's control touched** — refusing silently leaves the user pressing a button that does nothing. |
| `previous()` / `reset()` / `select(i)` | | | `select` refuses a step the linear rule has not opened yet. |
| `isFirst()` / `isLast()` / `currentPassable()` | `Signal<boolean>` | | For wiring the buttons. |

**rlb-step**

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | Name in the strip. |
| `hint` | `string` | — | A line under the label. |
| `step-control` | `AbstractControl` | — | The form this step owns. A linear stepper will not pass it while invalid. |
| `optional` | `boolean` | `false` | May be skipped even when linear. |
| `completed` | `boolean` | `false` | Marks it done when it has no control to prove it. |
| `state` | `'todo' \| 'done' \| 'error'` | — | Forces the circle; otherwise worked out from `step-control`. |

The circle goes grey → blue (current) → green (passed) → red (invalid and touched).

---

## Empty state (rlb-empty-state)

There is nothing here, said properly. `rlb-dt-noitems` only works inside the datatable; this is the
same idea everywhere else.

```html
<rlb-empty-state title="No users yet">
  Invite someone and they will show up here.
  <button actions rlb-button color="primary" size="sm">Invite</button>
</rlb-empty-state>

<rlb-empty-state variant="search" title="Nothing matches" size="sm">Try a shorter word.</rlb-empty-state>
<rlb-empty-state variant="error" title="Could not load" size="sm">Try again in a moment.</rlb-empty-state>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | The line in bold. |
| `variant` | `'empty' \| 'search' \| 'error' \| 'custom'` | `'empty'` | Picks a fitting icon, so the common cases need no `icon`. |
| `icon` | `string` | — | An icon class, overriding the variant's. |
| `size` | `'sm' \| 'md'` | `'md'` | |

Default content is the sentence; project buttons with the `actions` attribute.

---

## Popconfirm ([rlb-popconfirm])

«Are you sure?» anchored to the button that asked it. Use this rather than
`ModalService.openConfirmModal` for row-level destructive actions — a full-screen modal is the wrong
size of interruption for «delete this row».

```html
<button
  rlb-button
  color="danger"
  size="sm"
  rlb-popconfirm="Delete this row?"
  popconfirm-title="This cannot be undone"
  confirm-label="Delete"
  cancel-label="Keep"
  placement="top"
  (confirmed)="remove(row)"
>
  Delete
</button>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `rlb-popconfirm` | `string` | `''` | What is being asked. Also the panel's accessible name when there is no title. |
| `popconfirm-title` | `string` | — | Bold line above the question. |
| `confirm-label` / `cancel-label` | `string` | `'Yes'` / `'No'` | |
| `confirm-color` | `Color` | `'danger'` | |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Flips when there is no room. |
| `disabled` | `boolean` | `false` | |
| `(confirmed)` / `(cancelled)` | `void` | | Nothing happens until `confirmed`. Escape, backdrop and «No» all emit `cancelled`. |

Focus starts on the **cancel** button: the point of a popconfirm is to be a speed bump, and a
confirm button with focus on it is not one.

⚠️ Built on CDK Overlay — the app must load `@angular/cdk/overlay-prebuilt.css`, or the panel lands
in the page corner. `ng add` registers it.

---

## Theme toggle (rlb-theme-toggle)

```html
<rlb-theme-toggle />
<rlb-theme-toggle [modes]="['light', 'dark']" show-label color="primary" size="sm" />
```

Walks through the themes in `modes` (`['light','dark','auto']` by default) and shows the icon of the
current one. State lives in `ThemeService`, so several toggles on one page agree. See
**Configuration** below.

---

## Stat tile (rlb-stat)

One number, with what it means and which way it is going.

```html
<rlb-stat
  label="Revenue"
  value="12.480 €"
  [delta]="12"
  delta-label="vs last month"
  icon="bi bi-cash-coin"
  [sparkline]="[12, 15, 14, 19, 18, 24, 27]"
/>

<!-- Down is the good news: the colour flips, the arrow does not. -->
<rlb-stat label="p95 latency" value="141 ms" [delta]="-22" invert-delta color="info" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | What the number is. |
| `value` | `string \| number` | `''` | **Already formatted.** A component cannot know whether 1234.5 is money, a count or a percentage, nor in which locale — formatting stays with the caller. |
| `delta` | `number` | — | The change; its sign picks the arrow and the colour. Left out, nothing is drawn. |
| `delta-text` | `string` | — | How the change is written. Default is the delta with a sign and a `%`. |
| `delta-label` | `string` | — | The line underneath: «vs last month». |
| `invert-delta` | `boolean` | `false` | For churn, latency, cost. |
| `sparkline` | `number[]` | `[]` | Drawn once there are two points. Decoration, `aria-hidden`. |
| `icon` / `color` / `loading` / `flat` | | | |

The direction is never colour alone: an arrow and a sign carry it too.

---

## Timeline (rlb-timeline + rlb-timeline-item)

An activity feed, an audit log, the history of a record.

```html
<rlb-timeline group-by-day timezone="Europe/Rome" day-format="WL DD LM yyyy" locale="it">
  <rlb-timeline-item [time]="created" heading="Created" icon="bi bi-plus-lg">
    Mario opened the ticket.
  </rlb-timeline-item>
  <rlb-timeline-item [time]="escalated" heading="Escalated" color="warning">…</rlb-timeline-item>
  <rlb-timeline-item heading="Waiting" pending color="secondary">Not yet.</rlb-timeline-item>
</rlb-timeline>
```

**rlb-timeline**: `group-by-day`, `timezone`, `locale`, `time-format` (`'HH:mm'`),
`day-format` (`'WL DD LM yyyy'`), `compact`.

**rlb-timeline-item**: `heading`, `time` (`IDateTz | string`), `icon`, `color`, `pending`.

Grouping is the reason this is a component rather than a `@for`: the day is worked out from local
midnight in the timeline's timezone. An entry at 00:30 in Rome is still the previous day in UTC, and
tz-naive day maths puts it under the wrong heading. An `IDateTz` is formatted by the timeline and
groups; a plain string is printed as given and takes no part in grouping.

---

## Virtual list (rlb-virtual-list)

A long list that renders only what is on screen, over the CDK's virtual scroller.

```html
<rlb-virtual-list [items]="rows()" [item-size]="52" height="22rem" (near-end)="loadMore()">
  <ng-template let-row let-i="index">
    <div class="px-3 py-2 border-bottom" style="height: 52px">{{ i + 1 }} — {{ row.name }}</div>
  </ng-template>
</rlb-virtual-list>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `items` | `readonly T[]` | `[]` | |
| `item-size` | `number` | `48` | Fixed row height in px. **It must match what the template renders**, or the scrollbar lies about the length of the list. |
| `height` | `string` | `'20rem'` | Without a height there is nothing to scroll inside. |
| `threshold` | `number` | `10` | How far from the end `(near-end)` fires. |
| `track-by` | `(i, item) => unknown` | the index | |
| `(near-end)` | `void` | | Fires once per arrival — **the caller must still ignore it while a page is in flight.** |
| `(scrolled-index)` | `number` | | First rendered row. |

The row template is projected as the only content, with `let-item` and `let-i="index"`.

---

## Command palette (rlb-command-palette)

Everything the application can do, one keystroke away. Mount it **once**, near the root, the way
`rlb-modal-container` is mounted; it renders nothing until it opens.

```html
<rlb-command-palette [commands]="commands" shortcut="mod+k" />
```

```typescript
import { RlbCommand } from '@open-rlb/ng-bootstrap';

readonly commands: RlbCommand[] = [
  {
    id: 'new-user',                 // stable: it is how «recent» remembers this command
    label: 'New user',
    group: 'Users',
    icon: 'bi bi-person-plus',
    keywords: ['create', 'add'],    // also searched: synonyms, the old name, an abbreviation
    shortcut: 'N',                  // shown only; the palette does not bind it
    run: () => this.router.navigate(['/users/new']),
  },
];
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `commands` | `readonly RlbCommand[]` | `[]` | |
| `shortcut` | `string` | `'mod+k'` | `mod` is Cmd on a Mac and Ctrl elsewhere, so one string covers both. Empty turns it off. |
| `recent-count` | `number` | `3` | Recently used at the top when the box is empty. `0` turns it off. |
| `title` / `placeholder` / `emptyLabel` / `recentLabel` | `string` | English | |
| `(executed)` | `RlbCommand` | | Already run. |
| `open()` / `close()` | | | Drive it from a button as well. |

Matching is by subsequence — every letter of the query in order — so `dbs` finds «Dashboard
settings». Matches at a word boundary and consecutive matches score higher, and a shorter label wins
a tie. Arrows move and wrap, Enter runs, Escape closes. A `disabled` command stays out of the list
until it is searched for.

⚠️ CDK Overlay again: the application must load `@angular/cdk/overlay-prebuilt.css`.

---

## Tree (rlb-tree)

Nested things that are data rather than navigation: categories, permissions, folders, an org chart.
`rlb-sidebar-item` also nests, but only as a menu.

```html
<rlb-tree
  [nodes]="catalogue"
  [(expanded)]="openIds"
  [(selected)]="chosenIds"
  [filter]="query()"
  (activated)="open($event)"
/>

<!-- Permissions: ticking a branch ticks everything under it. -->
<rlb-tree [nodes]="permissions" checkboxes [(selected)]="granted" />
```

```typescript
export interface RlbTreeNode {
  id: string;          // unique across the whole tree: state is remembered by it
  label: string;
  icon?: string;
  children?: RlbTreeNode[];
  disabled?: boolean;
}
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `RlbTreeNode[]` | `[]` | Plain data. The tree keeps no copy and no state beyond what is bound. |
| `expanded` | `string[]` | `[]` | Open branches, by id. Two-way — put it in the URL if the page should come back the same. |
| `selected` | `string[]` | `[]` | Taken nodes, by id. One without `checkboxes`, any number with. |
| `checkboxes` | `boolean` | `false` | A box on every node; a branch takes everything under it. |
| `branch-selectable` | `boolean` | `true` | Off, clicking a branch only opens it — for a tree whose branches are headings. |
| `filter` | `string` | `''` | Keeps the matches and the branches above them, and opens those branches: a hit inside a closed branch is a hit nobody finds. |
| `activated` | `EventEmitter<RlbTreeNode>` | — | A label was clicked. Branches too. |

Methods: `toggle(id)`, `expandAll()`, `collapseAll()`, `check(node, checked)`, and
`checkedState(node)` → `'true' | 'false' | 'mixed'`.

Two things it does that the hand-written version usually does not:

- A branch only some of whose children are ticked is **indeterminate**, not unticked. A half-ticked
  branch drawn as unticked is how «apply to all» quietly does the wrong thing.
- Ticking the last child by hand promotes the branch to fully ticked. A branch is in the selection
  exactly when all of it is, so the drawing and the value never disagree.

Helpers are exported for the data itself: `flattenTree(nodes)`, `subtreeIds(node)` and
`idsMatching(nodes, predicate)` — the last returns `{ hits, open }`, the ids to show and the
branches to open for them.

For a tree inside a form control, use `rlb-tree-select` (**rlb-inputs** skill).

---

## Configuration tokens

Three injection tokens set library-wide behaviour. All optional; all have working defaults.

### provideRlbIcons — the icon set

Every icon the library draws is named by meaning, not by glyph, and resolved through `RLB_ICONS`.
Default is bootstrap-icons. Names left out keep their default.

```typescript
import { provideRlbIcons } from '@open-rlb/ng-bootstrap';

provideRlbIcons({ delete: 'fa-solid fa-trash', refresh: 'fa-solid fa-arrows-rotate' });
```

Names: `refresh, add, close, search, more, edit, delete, chevronLeft, chevronRight, chevronDown,
upload, file, reply, read, sortAscending, sortDescending, sortNone, download, columns, warning,
empty, check, calendar, clock, star, starFilled, trendUp, trendDown, trendFlat, themeLight,
themeDark, themeAuto` (the `RlbIconSet` interface).

### provideRlbTheme — dark mode

Drives Bootstrap 5.3's `data-bs-theme` from signals. **Not** part of `provideRlbBootstrap()`: an app
that never asked for a theme should not find `data-bs-theme` written on its `<html>`.

```typescript
import { provideRlbTheme, ThemeService } from '@open-rlb/ng-bootstrap';

providers: [provideRlbBootstrap(), provideRlbTheme()]

// options, all optional:
provideRlbTheme({
  defaultTheme: 'auto',      // 'light' | 'dark' | 'auto' — auto follows prefers-color-scheme
  storageKey: 'rlb-theme',   // null turns persistence off
  target: 'root',            // 'root' (<html>) | 'body'
  storage: myAccountStorage, // anything with getItem/setItem, e.g. the user's account
});
```

`ThemeService`: `theme()` is what was asked for (may be `'auto'`), `resolved()` is what Bootstrap was
actually told, `isDark()`, `set(theme)`, `toggle()`. `toggle()` from `'auto'` leaves `'auto'` —
asking for the opposite of the system is a choice, not a preference to keep following.

### provideRlbDefaults — labels, page sizes, timezone

Sets once what would otherwise be said on every element. An element that says something still wins.

```typescript
provideRlbDefaults({
  table: {
    pageSize: 25,
    pageSizes: [25, 50, 100],
    actionsLabel: 'Azioni', loadMoreLabel: 'Carica altri',
    refreshLabel: 'Aggiorna', createLabel: 'Nuovo',
    sortLabel: 'Ordina', filterLabel: 'Filtra',
    selectRowLabel: 'Seleziona riga', selectAllLabel: 'Seleziona tutto',
    columnsLabel: 'Colonne', exportLabel: 'Esporta CSV', clearSelectionLabel: 'Pulisci',
    selectedCountLabel: n => `${n} selezionate`,
  },
  date: { timezone: 'Europe/Rome' },
});
```

---

## Translations

The library depends on **no** translation package. Text a caller can pass in is an input with an
English default; the one component that takes *keys* (`rlb-form-fields`, whose field definitions are
data) resolves them through `RLB_TRANSLATION_SERVICE`, returning the key unchanged when nothing is
registered.

```typescript
import { TranslateService } from '@ngx-translate/core';
import { RLB_TRANSLATION_SERVICE } from '@open-rlb/ng-bootstrap';

providers: [{ provide: RLB_TRANSLATION_SERVICE, useExisting: TranslateService }];
```

The `rlbTranslate` pipe is exported for your own templates and goes through the same token.

---

## Module Import

```typescript
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';

@NgModule({
  imports: [RlbBootstrapModule],
})
export class AppModule {}
```

Or import individual components for standalone:

```typescript
import { ButtonComponent, AlertComponent, CardComponent } from '@open-rlb/ng-bootstrap';
```
