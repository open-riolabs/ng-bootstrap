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
<button rlb-button color="primary" size="md">Click me</button>
<button rlb-button color="danger" outline>Delete</button>
<button rlb-button color="secondary" [disabled]="true">Disabled</button>
<a rlb-button color="info" isLink>Link</a>

<!-- Button group -->
<rlb-button-group orientation="horizontal" size="md">
  <button rlb-button color="primary">A</button>
  <button rlb-button color="primary">B</button>
</rlb-button-group>

<!-- FAB (Floating Action Button) -->
<rlb-fab color="primary" size="md" position="br">
  <i class="bi bi-plus"></i>
</rlb-fab>
```

**Button inputs:** `color`, `size`, `disabled`, `outline`, `isLink`
**FAB inputs:** `color`, `size`, `disabled`, `outline`, `position` ('br'|'bl'|'tr'|'tl')

---

## Alerts

```html
<rlb-alert color="success">Operation successful.</rlb-alert>
<rlb-alert color="danger" [dismissible]="true" (dismissed)="onDismiss()">
  An error occurred!
</rlb-alert>
```

**Inputs:** `color`, `dismissible` (boolean), `class`
**Outputs:** `dismissed`

---

## Badges

```html
<span rlb-badge color="primary">New</span>
<span rlb-badge color="success" [pill]="true">Active</span>
<span rlb-badge color="danger" [border]="true">3</span>
```

**Inputs:** `color`, `pill`, `border`, `hidden-text`, `class`, `badge-text-color`

---

## Avatar

```html
<rlb-avatar [size]="48" shape="circle" src="/assets/user.png"></rlb-avatar>
<rlb-avatar [size]="40" shape="round">AB</rlb-avatar>
<rlb-avatar [size]="56" shape="square" src="/assets/logo.png"></rlb-avatar>
```

**Inputs:** `size` (px number), `shape` ('circle'|'round'|'square'), `src`, `class`

---

## Cards

```html
<rlb-card align="left" background="light">
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
<rlb-accordion [flush]="false" [always-open]="false" [card-style]="true">
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

```html
<rlb-tabs view="tab" [vertical]="false" fill="fill">
  <rlb-tab title="Tab 1">Content for tab 1</rlb-tab>
  <rlb-tab title="Tab 2">Content for tab 2</rlb-tab>
  <rlb-tab title="Tab 3" [disabled]="true">Disabled</rlb-tab>
</rlb-tabs>
```

**Inputs:** `view` ('tab'|'pills'|'underline'|'none'), `vertical`, `fill` ('fill'|'justified'), `horizontal-alignment` ('center'|'end'), `id`, `class`

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
  <rlb-carousel-item>Slide 1</rlb-carousel-item>
  <rlb-carousel-item>Slide 2</rlb-carousel-item>
</rlb-carousel>
```

**Inputs:** `autoplay`, `interval`, `pause`, `wrap`, `cross-fade`, `hide-indicators`, `hide-controls`, `no-touch`, `keyboard`, `id`
**Two-way:** `current-slide`
**Outputs:** `slid`, `slide`, `slide-count`
**Methods (via viewChild):** `prev()`, `next()`, `to(index)`, `pause()`, `cycle()`

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
  <div rlb-dropdown-menu>
    <a class="dropdown-item" href="#">Option 1</a>
    <a class="dropdown-item" href="#">Option 2</a>
  </div>
</rlb-dropdown>
```

**Inputs:** `direction` ('up'|'down'|'left'|'right'|'up-center'|'down-center')

---

## Pagination

```html
<rlb-pagination size="md" alignment="center">
  <rlb-pagination-item [active]="true">1</rlb-pagination-item>
  <rlb-pagination-item>2</rlb-pagination-item>
</rlb-pagination>
```

**Inputs:** `size`, `alignment` ('start'|'center'|'end'), `class`

---

## Navigation (Navbar + Sidebar)

```html
<rlb-navbar color="primary" [dark]="true" expand="lg" placement="fixed-top">
  <a rlb-navbar-brand href="/">MyApp</a>
  <rlb-navbar-items>
    <a class="nav-link" routerLink="/home">Home</a>
  </rlb-navbar-items>
</rlb-navbar>

<rlb-sidebar [dark]="true" [rounded]="false">
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
<rlb-spinner style="border" color="primary" size="md"></rlb-spinner>
<rlb-spinner style="grow" color="success" size="sm"></rlb-spinner>

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
<rlb-progress [infinite]="true" color="info"></rlb-progress>
```

**Spinner inputs:** `style` ('border'|'grow'), `color`, `size`
**Progress inputs:** `value`, `max`, `min`, `height`, `animated`, `striped`, `infinite`, `showValue`, `color`, `text-color`, `aria-label`

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
<button rlb-button rlb-tooltip title="Helpful tip" placement="top">Hover me</button>
```

---

## Collapse & Offcanvas

```html
<!-- Collapse -->
<button rlb-button rlb-collapse-toggle target="myCollapse">Toggle</button>
<rlb-collapse id="myCollapse">Hidden content</rlb-collapse>

<!-- Offcanvas -->
<button rlb-button rlb-offcanvas-toggle target="myPanel">Open Panel</button>
<rlb-offcanvas id="myPanel" placement="start">Panel content</rlb-offcanvas>
```

---

## Module Import

```typescript
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';

@NgModule({
  imports: [RlbBootstrapModule]
})
export class AppModule {}
```

Or import individual components for standalone:
```typescript
import { ButtonComponent, AlertComponent, CardComponent } from '@open-rlb/ng-bootstrap';
```
