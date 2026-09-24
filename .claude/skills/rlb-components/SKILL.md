---
name: rlb-components
description: Expert guidance for the @open-rlb/ng-bootstrap Angular component library — buttons, split buttons, FABs, cards, alerts, badges, avatars and avatar groups, accordion, tabs, carousel, breadcrumb, pagination, navbar, nav, sidebar, collapse, offcanvas, scrollspy, spinners and progress, toasts, stepper/wizard and the theme toggle — plus its configuration tokens for icons, dark mode, global defaults and translations. Built on Angular signals, OnPush and Bootstrap 5. Use when using or composing these UI components, or when configuring the library.
---

# RLB ng-Bootstrap Components Skill

You are an expert in the **@open-rlb/ng-bootstrap** Angular component library. All components use Angular signals, `ChangeDetectionStrategy.OnPush`, and Bootstrap 5. The library requires Angular 22. Import via `RlbBootstrapModule` or individual standalone imports.

**Sibling skills — do not duplicate their subjects here:**

| Subject | Skill |
|---|---|
| Dropdowns, tooltips, popovers, popconfirm, any floating panel | **rlb-overlays** |
| Stat tiles, timelines, virtual lists, trees, command palette, empty states, lists, chat, skeletons | **rlb-data-display** |
| Form controls, validation, `rlb-form-fields` | **rlb-inputs** |
| `rlb-dt-table` | **rlb-datatable** |
| `rlb-calendar` | **rlb-calendar** |
| Modals and dialog accessibility | **rlb-modals** |
| `ng add`, `sync-skills`, required stylesheets | **rlb-schematics** |

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

**`button[rlb-button]` / `a[rlb-button]` inputs:** `color` (`Color`, default `'primary'`), `size`
(`Size`, default `'md'`), `disabled`, `outline`, `isLink` — all booleans default `false`. None are
aliased, so `isLink` is written exactly like that.

**`rlb-fab` inputs:** `color`, `size` (`'xs' | 'sm' | 'md' | 'lg'` — note the extra `xs`),
`disabled`, `outline`, `position` (`'br' | 'bl' | 'tr' | 'tl'`; unset, it is not pinned).

**`rlb-button-group`** and **`rlb-button-toolbar`**: `orientation` (`'horizontal' | 'vertical'`,
default `'horizontal'`) and `size` (`'sm' | 'md' | 'lg'`, default `'md'`).

**`button[rlb-button-close]` / `a[rlb-button-close]`**: Bootstrap's `.btn-close` ✕, no inputs. Give
it an `aria-label`.

**`rlb-fab-input`**: a FAB that expands into a text field. Project an `rlb-input` into it; it emits
`(pasteAccepted)` → `string` when the user pastes.

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

⚠️ **Only four of the card parts are elements.** The title, subtitle, text, link and image are
**attribute selectors** on real HTML tags — a heading stays a heading, a paragraph a paragraph.
Earlier versions of this document wrote them all as `<rlb-card-*>` elements; those match nothing and
render as unknown tags.

```html
<rlb-card
  align="left"
  background="light"
>
  <rlb-card-header>Featured</rlb-card-header>
  <img rlb-card-image position="top" src="/img.png" alt="" />
  <rlb-card-body>
    <h5 rlb-card-title>Title</h5>
    <h6 rlb-card-subtitle>Subtitle</h6>
    <p rlb-card-text>Body text here.</p>
    <a rlb-card-link href="/more">Read more</a>
  </rlb-card-body>
  <rlb-card-footer>Footer</rlb-card-footer>
</rlb-card>

<!-- Several cards as one unit -->
<rlb-card-group>
  <rlb-card>…</rlb-card>
  <rlb-card>…</rlb-card>
</rlb-card-group>
```

**`rlb-card` inputs:** `align` (`TextAlignment`, default `'left'`), `overlay` (boolean — draws the
body over the image), `background` (`Color`), `border` (`Color`).

| Part | Selector | Notes |
|---|---|---|
| Body, header, footer, group | `rlb-card-body`, `rlb-card-header`, `rlb-card-footer`, `rlb-card-group` | Elements. |
| Title | `h*[rlb-card-title]` | Any heading level — pick the right one for the page outline. |
| Subtitle | `h*[rlb-card-subtitle]` | |
| Text | `p[rlb-card-text]` | A `<p>`, nothing else. |
| Link | `a[rlb-card-link]` | |
| Image | `img[rlb-card-image]` | Input `position`: `'top'` (default) or `'bottom'`. |

---

## Accordion

⚠️ The item and the body are **attributes on a `div`**; only the header is an element. Earlier
versions of this document wrapped both in `<ng-template>`, which renders nothing.

```html
<rlb-accordion
  [flush]="false"
  [always-open]="false"
  [card-style]="true"
>
  <div rlb-accordion-item expanded>
    <rlb-accordion-header>Section 1</rlb-accordion-header>
    <div rlb-accordion-body>Content 1</div>
  </div>
  <div rlb-accordion-item (statusChange)="onToggle($event)">
    <rlb-accordion-header>Section 2</rlb-accordion-header>
    <div rlb-accordion-body>Content 2</div>
  </div>
</rlb-accordion>
```

**`rlb-accordion` inputs:** `flush` (boolean, default `false`), `always-open` (boolean, default
`false` — leave several open at once), `card-style` (boolean, default **`true`**), `id`.

**`div[rlb-accordion-item]` inputs:** `name`, `expanded` (boolean, default `false` — seeds the open
one), `class`, `style`. Output `(statusChange)` → `VisibilityEvent`
(`'show' | 'shown' | 'hide' | 'hidden' | 'hidePrevented'`).

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

Moved to the **rlb-overlays** skill, with the tooltip, the popover and the popconfirm — they all run
on the same CDK Overlay and share the same requirements.

```html
<rlb-dropdown direction="down">
  <button rlb-button color="primary" rlb-dropdown>Actions</button>
  <ul rlb-dropdown-menu placement="right">
    <li rlb-dropdown-item (click)="rename()">Rename</li>
    <li rlb-dropdown-item divider></li>
    <li rlb-dropdown-item link="/settings" fragment="profile">Settings</li>
  </ul>
</rlb-dropdown>
```

The three things to remember here:

- **`@angular/cdk/overlay-prebuilt.css` is required** by any app that opens a dropdown. Without it
  the menu opens in the page corner. `ng add` registers it.
- `auto-close="outside"` for a menu of checkboxes; the default closes on the first tick.
- `anchor="parent"` when the toggle is a sliver at the end of a button group.


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
    <rlb-navbar-item router-link="/home">Home</rlb-navbar-item>
    <rlb-navbar-dropdown-item dropdown auto-close="outside">More</rlb-navbar-dropdown-item>
    <rlb-navbar-separator />
    <rlb-navbar-text>v2.1</rlb-navbar-text>
  </rlb-navbar-items>
  <rlb-navbar-form>
    <rlb-input placeholder="Search" />
  </rlb-navbar-form>
</rlb-navbar>

<rlb-sidebar
  [dark]="true"
  [rounded]="false"
>
  <rlb-sidebar-item title="Dashboard" icon="bi bi-speedometer2" [link]="['/dashboard']" />
  <rlb-sidebar-item title="Settings" [link]="['/settings']" fragment="profile" [badgeCounter]="3">
    <rlb-sidebar-item title="Profile" [link]="['/settings/profile']" />
  </rlb-sidebar-item>
</rlb-sidebar>
```

**`rlb-navbar` inputs:** `dark` (default `true`), `color`, `placement`
(`'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom'`), `expand`
(`'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always'`), `showSideBarToggler` (default `true`),
`enable-dropdown-toggler` (default `false`), `class`.

⚠️ `showSideBarToggler` has **no alias** — write it exactly like that, with the capital B in
«SideBar». Earlier versions of this document said `show-sidebar-toggler`, which binds nothing.

**Navbar children:** `rlb-navbar-items` (groups the links), `rlb-navbar-item`
(`disabled`, `router-link`, `class`, `(click)`), `rlb-navbar-dropdown-item`
(`disabled`, `dropdown`, `href`, `toggle`, `auto-close`, `(click)`, `(status-changed)` — it rides
the same overlay as `rlb-dropdown`, see **rlb-overlays**), `rlb-navbar-separator`,
`rlb-navbar-text`, `rlb-navbar-form`, and the directives `[rlb-navbar-brand]` and
`[rlb-custom-navbar-items]` (content placed outside the collapsible area).

**`rlb-sidebar` inputs:** `dark` (default `true`), `rounded` (default `false`). Open and close it
from `SidebarService`.

**`rlb-sidebar-item` inputs:** `title`, `icon`, `label`, `link` (`any[] | string`), `fragment`,
`badgeCounter` (`number`), `(click)`. Nest `rlb-sidebar-item` inside one another for a submenu —
a nested item is a menu entry, not a data tree (for that, see `rlb-tree` in **rlb-data-display**).

`fragment` is the `#fragment` of `link`, for a menu that points into a long page. The same input
exists on `li[rlb-dropdown-item]`.

---

## Nav (rlb-nav + rlb-nav-item)

The tab strip's simpler cousin: a list of links with no panes behind them. `rlb-tabs` switches
content; `rlb-nav` just navigates.

```html
<rlb-nav view="pills" horizontal-alignment="center">
  <rlb-nav-item active href="/overview">Overview</rlb-nav-item>
  <rlb-nav-item href="/activity">Activity</rlb-nav-item>
  <rlb-nav-item [disabled]="true">Archive</rlb-nav-item>
</rlb-nav>
```

**`rlb-nav` inputs:** `view` (`'tab' | 'tabs' | 'pills' | 'underline' | 'none'`, default `'tab'`),
`vertical`, `pills`, `tabs`, `underline` (booleans, alternatives to `view`),
`fill` (`'fill' | 'justified'` or a boolean), `horizontal-alignment` (`'center' | 'end'`), `class`.

**`rlb-nav-item` inputs:** `active`, `disabled`, `href`, `class`.

---

## Scrollspy ([rlb-scrollspy])

Highlights the entry in a nav that matches the section currently on screen.

```html
<rlb-nav view="pills" vertical id="toc">
  <rlb-nav-item href="#intro">Intro</rlb-nav-item>
  <rlb-nav-item href="#usage">Usage</rlb-nav-item>
</rlb-nav>

<div rlb-scrollspy rlb-scrollspy-target="toc" height="70vh" (scroll-change)="onScroll($event)">
  <section id="intro">…</section>
  <section id="usage">…</section>
</div>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `rlb-scrollspy-target` | `string` | — | **Required.** The id of the nav to highlight. |
| `height` | `string` | `'200px'` | The scrolling box's height. |
| `scroll-smooth` | `boolean` | `true` | Smooth-scrolls when an entry is clicked. |
| `scroll-root-margin` | `string` | `''` | `IntersectionObserver` root margin. |
| `scroll-threshold` | `number[]` | `[]` | `IntersectionObserver` thresholds. |
| `(scroll-change)` | `Event` | | |

---

## Loaders

⚠️ The spinner's variant input is aliased **`style`**, which collides with the native `style`
attribute. **Always bind it** — `[style]="'border'"` — never `style="border"`, which Angular reads
as an inline CSS string. (Same class of trap as `[popover]`.)

```html
<!-- Spinner -->
<rlb-spinner
  [style]="'border'"
  color="primary"
  size="md"
></rlb-spinner>
<rlb-spinner
  [style]="'grow'"
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

**`rlb-spinner` inputs:** `style` (`'border' | 'grow'`, default `'border'` — **bind it**), `color`
(`Color`, default `'primary'`, rendered as a `text-*` class), `size` (`'sm' | 'md' | 'lg'`, default
`'md'`; only `sm` and `lg` change anything). It carries `role="status"` and a visually-hidden
«Loading…».

**`rlb-progress` inputs:** `value` (default `0`), `max` (default `100`), `min` (default `0`),
`height` (number, px), `animated`, `striped`, `infinite`, `showValue` (*camelCase, no alias*),
`color` (default `'primary'`), `text-color`, `aria-label`.

`infinite` is the indeterminate bar — use it when you cannot know the proportion. Give a progress
bar an `aria-label` whenever there is no visible label beside it.

---

## Placeholders (skeletons)

Moved to the **rlb-data-display** skill: `rlb-placeholder`, `rlb-placeholder-line`,
`rlb-placeholder-text` and the `[rlb-placeholder]` directive.


## Toast

⚠️ `openToast` takes **four** arguments: the container id, the registered toast name, the **data**
(required, and `title` + `content` are required within it) and optional options. Earlier versions of
this document showed a two-argument call; it does not compile.

Toasts work like modals: register the component by name, put a container in the layout, open by
name. See **rlb-modals** for the same pattern in full.

```typescript
// app.config.ts
providers: [
  provideRlbBootstrap(),
  { provide: ToastRegistryOptions, useValue: { toasts: { 'sample-toast': ToastSampleComponent } }, multi: true },
];
```

```html
<!-- Somewhere in the root layout, usually pinned to a corner -->
<rlb-toast-container id="toast-c-1" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11" />
```

```typescript
private readonly toasts = inject(ToastService);

saved() {
  this.toasts
    .openToast('toast-c-1', 'sample-toast', {
      title: 'Saved',
      content: 'Your changes are in.',
      subtitle: 'just now',
      type: 'success',          // ModalType: 'success' | 'info' | 'warning' | 'error'
      ok: 'OK',
    }, { autohide: true, delay: 4000, color: 'success' })
    .subscribe(result => console.log(result)); // ToastResult | null
}
```

```typescript
interface ToastData<T = any> { title: string; content: T; subtitle?: string; type?: ModalType; ok?: string }
interface ToastResult<T = void> { reason: ToastCloseReason; result: T | null }  // 'ok' | 'cancel' | 'close'
interface ToastOptions { animation?: boolean; autohide?: boolean; delay?: number; color?: Color; classes?: string[] }
```

A toast component implements `IToast<Input, Output>` — the same shape as `IModal`
(`data: Signal<ToastData<Input>>`, optional `valid`, optional `result`) — and applies the
`[rlb-toast]` directive as a host directive with the inputs `id`, `data-instance`, `data-options`.

You can have several containers with different ids (one per corner); the first argument picks which.

---

## Tooltip & popover

Moved to the **rlb-overlays** skill.

⚠️ The selectors are `[tooltip]` and `[popover]`, not `rlb-tooltip`. Earlier versions of this
document said otherwise; they were wrong. And always **bind** `[popover]` — a static
`popover="…"` is also the native HTML popover attribute, which hides the host.

```html
<button rlb-button tooltip="Helpful tip" tooltip-placement="top">Hover me</button>
<button rlb-button [popover]="'The body'" popover-title="A title">Click me</button>
```

---

## Collapse & Offcanvas

⚠️ The trigger is `toggle` + `toggle-target` on a `button` or an `a`. There is no
`rlb-collapse-toggle` or `rlb-offcanvas-toggle`; earlier versions of this document invented them.

```html
<!-- Collapse -->
<button rlb-button toggle="collapse" toggle-target="myCollapse">Toggle</button>
<rlb-collapse id="myCollapse">Hidden content</rlb-collapse>

<!-- Offcanvas: give it a heading with [rlb-offcanvas-title] — that is what names it. -->
<button rlb-button toggle="offcanvas" toggle-target="myPanel">Open Panel</button>
<rlb-offcanvas id="myPanel" placement="start">
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Filters</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>Panel content</rlb-offcanvas-body>
</rlb-offcanvas>
```

**`[toggle]` directive** — on `button`, `a`, `rlb-navbar-item`, `rlb-button-toolbar` or `rlb-fab`:

| Input | Type | Default | Notes |
|---|---|---|---|
| `toggle` | `'offcanvas' \| 'collapse' \| 'tab' \| 'pill' \| 'dropdown' \| 'buttons-group'` | — | **Required.** |
| `toggle-target` | `string` | — | **Required.** The target's `id`. |
| `collapsed` | `boolean` | `false` | Starts collapsed. |
| `auto-close` | `'default' \| 'inside' \| 'outside' \| 'manual'` | `'default'` | |

`toggle` accepts `'dropdown'`, but it does nothing: a dropdown is `[rlb-dropdown]` inside
`rlb-dropdown` (see **rlb-overlays**).

**`rlb-collapse` inputs:** `id` (**required**), `orientation` (`'horizontal' | 'vertical'`, default
`'vertical'`). Output `(statusChange)` → `VisibilityEvent`.

**`rlb-offcanvas` inputs:** `id` (**required**), `placement` (`'start' | 'end' | 'top' | 'bottom'`,
default `'start'`), `responsive` (`'sm' … 'xxl'` — a panel below that width, ordinary content above),
`body-scroll` (lets the page behind keep scrolling), `scroll-backup`, `close-manual` (no backdrop
dismiss). Output `(statusChange)` → `VisibilityEvent`.

Children: `rlb-offcanvas-header`, `rlb-offcanvas-body`, and the title as an attribute on a heading —
`h*[rlb-offcanvas-title]` (there is also a bare `[rlb-offcanvas-title]` directive for a non-heading
element). ⚠️ There is **no exported offcanvas footer** component; put footer content at the end of
the body.

---

## Dialog accessibility (modal and offcanvas)

Both get `role="dialog"` and `aria-modal` from Bootstrap, and Bootstrap traps focus inside them.
Three things the library now adds on top:

- **A name.** The heading — `.modal-title`, or `.offcanvas-title` from `[rlb-offcanvas-title]` — is
  given an id and referenced with `aria-labelledby`. Without it a screen reader announces «dialog»
  and stops. Give the dialog a heading, or write your own `aria-label` / `aria-labelledby` on the
  host — anything the caller says itself is left alone.
- **Focus back where it came from.** A modal returns focus to whatever opened it on *every* way
  out — the buttons, Escape, a click on the backdrop. It used to do it on three paths out of five,
  so closing with the keyboard left you at the top of the page.
- **Panels opened inside them work.** Bootstrap's trap pulls anything outside the dialog straight
  back in, and every panel here — dropdown, datepicker, time picker, tree select, popconfirm — is
  drawn by the CDK at the end of the body. The overlay container is moved inside the open dialog
  for as long as it is open, so those panels are reachable from the keyboard. Nothing to configure.

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

## Empty state, popconfirm

`rlb-empty-state` is in the **rlb-data-display** skill.
`[rlb-popconfirm]` is in the **rlb-overlays** skill — reach for it rather than
`ModalService.openConfirmModal` for a row-level destructive action.


## Theme toggle (rlb-theme-toggle)

```html
<rlb-theme-toggle />
<rlb-theme-toggle [modes]="['light', 'dark']" show-label color="primary" size="sm" />
```

Walks through the themes in `modes` (`['light','dark','auto']` by default) and shows the icon of the
current one. State lives in `ThemeService`, so several toggles on one page agree. See
**Configuration** below.

---

## Data and display components

These moved to the **rlb-data-display** skill:

| Component | What it is for |
|---|---|
| `rlb-stat` | One number, with what it means and which way it is going. |
| `rlb-timeline` + `rlb-timeline-item` | An activity feed or audit log, grouped by local day. |
| `rlb-virtual-list` | A long list that renders only what is on screen. |
| `rlb-tree` | Nested data the user opens and ticks. |
| `rlb-command-palette` | Everything the app can do, one keystroke away. |
| `rlb-empty-state` | There is nothing here, said properly. |
| `rlb-list`, `rlb-list-item`, `rlb-list-item-image` | Bootstrap list groups. |
| `rlb-chat-container` + `rlb-chat-item` | Message bubbles. |
| `rlb-placeholder*` | Loading skeletons. |


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
