---
name: rlb-components
description: Expert guidance for the @open-rlb/ng-bootstrap Angular component library (buttons, cards, dropdowns, toasts, loaders, badges, progress, etc.), built on Angular signals, OnPush, and Bootstrap 5. Use when using or composing these UI components.
---

# RLB ng-Bootstrap Components Skill

You are an expert in the **@open-rlb/ng-bootstrap** Angular component library. All components use Angular 18+ signals, `ChangeDetectionStrategy.OnPush`, and Bootstrap 5. Import via `RlbBootstrapModule` or individual standalone imports.

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
  <button
    rlb-button
    color="primary"
    rlb-dropdown
  >
    Actions
  </button>
  <div rlb-dropdown-menu>
    <a
      class="dropdown-item"
      href="#"
    >
      Option 1
    </a>
    <a
      class="dropdown-item"
      href="#"
    >
      Option 2
    </a>
  </div>
</rlb-dropdown>
```

**Inputs:** `direction` ('up'|'down'|'left'|'right'|'up-center'|'down-center')

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

## Tooltip

```html
<button
  rlb-button
  rlb-tooltip
  title="Helpful tip"
  placement="top"
>
  Hover me
</button>
```

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
