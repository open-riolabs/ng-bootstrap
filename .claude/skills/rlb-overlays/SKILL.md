---
name: rlb-overlays
description: Expert guidance for every @open-rlb/ng-bootstrap panel that floats above the page — dropdowns (rlb-dropdown, [rlb-dropdown]), tooltips ([tooltip]), popovers ([popover]), popconfirm ([rlb-popconfirm]), and the panels of the datepicker, time picker, tree select and command palette. All run on Angular CDK Overlay, not Bootstrap's JavaScript. Use when opening, positioning or debugging any floating panel, when a menu is clipped or lands in the page corner, or when a panel is opened from inside a modal or offcanvas.
---

# RLB ng-Bootstrap Overlays Skill

Every panel this library floats above the page is positioned by **Angular CDK Overlay**. Nothing
here is a `bootstrap.Dropdown`, `bootstrap.Tooltip` or `bootstrap.Popover` any more, and nothing
sets `data-bs-toggle`.

## The one requirement

```jsonc
// angular.json → projects.<app>.architect.build.options.styles
"styles": [
  "node_modules/@angular/cdk/overlay-prebuilt.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
]
```

⚠️ **`@angular/cdk/overlay-prebuilt.css` is required by any app that opens any of these.** It used
to be needed only for the datepicker and the popconfirm; since the dropdown, tooltip and popover
moved off Bootstrap's JavaScript it is needed for all of them. Without it the overlay container has
no position of its own and every panel opens in the top-left corner of the page.

`ng add @open-rlb/ng-bootstrap` registers it. In an app that predates that, add it by hand — this is
the single most common cause of "my menu appears in the corner". See the **rlb-schematics** skill.

`@angular/cdk` is a peer dependency (`>=22.0.0 <23.0.0`).

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
    <li rlb-dropdown-item link="/settings" fragment="profile">Settings</li>
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

| Element | Input / output | Type | Default | Notes |
|---|---|---|---|---|
| `rlb-dropdown` | `direction` | `RlbDropdownDirection` | `'down'` | `'up' \| 'down' \| 'left' \| 'right' \| 'up-center' \| 'down-center'`. A `-center` direction decides the alignment itself and ignores the menu's `placement`. |
| `a[rlb-dropdown]`, `button[rlb-dropdown]`, `span[rlb-badge][rlb-dropdown]` | `offset` | `number[]` | `[]` | `[x, y]` in px. It used to double as the switch between static and dynamic positioning; there is only one mode now, so an offset is only ever an offset. |
| | `auto-close` | `RlbDropdownAutoClose` | `'default'` | `'default' \| 'inside' \| 'outside' \| 'manual'`. |
| | `anchor` | `RlbDropdownAnchor` | `'self'` | `'self' \| 'parent'`. **No alias — write it camelCase-free as `anchor`.** `parent` lines the menu up with the box around the toggle, which is what a split button needs. |
| | `(status-changed)` | `VisibilityEventBase` | | `'show' \| 'shown' \| 'hide' \| 'hidden'`. |
| `ul[rlb-dropdown-menu]`, `rlb-dropdown-container` | `placement`, `placement-sm`, `placement-md`, `placement-lg`, `placement-xl`, `placement-xxl` | `'left' \| 'right'` | — | Per breakpoint. |
| `li[rlb-dropdown-item]` | `active`, `disabled`, `header`, `divider`, `text-wrap` | `boolean` | `false` | |
| | `link` | `string` | — | Renders an anchor with `routerLink`. |
| | `fragment` | `string` | — | The `#fragment` of that `routerLink` — for a menu that points into a long page. |

`auto-close` is the input people get wrong: `default` closes on the first click anywhere, including
inside the menu. **A menu of checkboxes or a filter panel wants `auto-close="outside"`**, or the
first tick closes it.

### What the CDK bought

- The menu is rendered at the end of the body, so an ancestor with `overflow: hidden` — a scrolling
  panel, a table cell — no longer clips it. The old fix was `data-bs-popper-config`, per call site.
- It flips instead of overflowing: a menu with no room below opens upwards.
- The keyboard works. Down opens with the first item focused, the arrows walk the **enabled** items
  and wrap, Home and End jump, Escape closes and hands focus back to the toggle. An action item is a
  real `<button>`, and an `<a>` toggle with no `href` is given `role="button"` and `tabindex="0"`.
- `rlb-navbar-dropdown-item`, `rlb-split-button`, `rlb-dt-actions` and the datatable's column menu
  all ride the same overlay.

⚠️ Bootstrap's bundle is still loaded for modals, collapse, tabs and carousel, and it still binds a
**capture-phase** keydown handler on the document for anything matching `.dropdown-menu`. Keys the
menu handles are stopped before they reach it — without that Bootstrap looks for a
`[data-bs-toggle]` that no longer exists and throws. Worth knowing if you add keys of your own to a
menu.

### Building your own toggle or menu

`RlbDropdownHost` is an abstract class used as an injection token, so a custom toggle can join an
existing `rlb-dropdown` by injecting it (`inject(RlbDropdownHost, { optional: true })`) and calling
`registerToggle(...)`. `RlbDropdownOverlay` is the service that owns the overlay; `rlb-dropdown`
provides one per instance. Both are exported, along with `RlbDropdownToggle`, `RlbDropdownAlign`,
`RlbDropdownDirection`, `RlbDropdownAnchor` and `RlbDropdownAutoClose`.

You rarely need them. Reach for them only when the toggle cannot be one of the three supported
elements.

---

## Tooltip and popover

⚠️ The selectors are **`[tooltip]`** and **`[popover]`**, not `rlb-tooltip`. Earlier versions of the
documentation said otherwise; they were wrong.

```html
<button rlb-button tooltip="Helpful tip" tooltip-placement="top">Hover me</button>

<!-- Markup instead of text. -->
<button rlb-button tooltip="<strong>Bold</strong> tip" tooltip-html>HTML</button>

<!-- ALWAYS bind [popover]: a static popover="…" is also the NATIVE HTML popover attribute,
     which puts the host into the browser's own manual popover state and hides it. -->
<button rlb-button [popover]="'The body'" popover-title="A title" popover-placement="bottom">
  Click me
</button>
```

| Attribute | Input | Type | Default | Notes |
|---|---|---|---|---|
| `[tooltip]` | `tooltip` | `string \| null` | — | The text. `null` or empty turns it off, and takes an open one away with it. Changing it while it is up rewrites it in place. |
| | `tooltip-placement` | `RlbHintPlacement` | `'top'` | `'top' \| 'bottom' \| 'left' \| 'right'`. A preference: with no room there it takes another side. |
| | `tooltip-class` | `string` | `''` | Extra classes on the panel. |
| | `tooltip-html` | `boolean` | `false` | Renders the value as markup. |
| `[popover]` | `popover` | `string` | — | The body, always written as text — markup is the tooltip's business, and its risk. |
| | `popover-title` | `string` | `''` | Header. |
| | `popover-placement` | `RlbHintPlacement` | `'top'` | |
| | `popover-class` | `string` | `''` | |

Triggers differ, and it matters:

- **Tooltip** opens on `mouseenter` **and `focusin`** — a tooltip only a mouse can reach is one that
  half the users never see — and closes on `mouseleave`, `focusout` or Escape. It ties itself to the
  trigger with `aria-describedby` while open, restoring whatever was there before on close.
- **Popover** toggles on **click**, writes `aria-expanded` on its trigger, and closes on an outside
  click or Escape.

Neither is clipped by an ancestor with `overflow: hidden`, and both flip rather than running off the
window. The arrow follows: the resolved side is measured, and the arrow is re-centred on the trigger
even after the overlay has been pushed sideways to stay on screen.

A tooltip with nothing to say refuses to open — it does not draw an empty box. A popover opens if it
has **either** a body or a title.

Exported pieces: `RlbHintOverlay` (the service, provided per directive, never in root),
`RlbHintConfig`, `HintPanelComponent` (`rlb-hint-panel`), `RlbHintKind` (`'tooltip' | 'popover'`),
`RlbHintPlacement`.

---

## Popconfirm

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
| `confirm-color` | `Color` | `'danger'` | Colour of the confirm button. |
| `placement` | `PopconfirmPlacement` | `'top'` | `'top' \| 'bottom' \| 'left' \| 'right'`. Flips when there is no room. |
| `disabled` | `boolean` | `false` | The trigger stops opening it. |
| `(confirmed)` / `(cancelled)` | `void` | | Nothing happens until `confirmed`. Escape, the backdrop and «No» all emit `cancelled`. |

Focus starts on the **cancel** button: the point of a popconfirm is to be a speed bump, and a
confirm button with focus on it is not one. On close, focus goes back to the trigger.

The directive calls `preventDefault()` and `stopPropagation()` on the trigger's click — the trigger
usually sits inside a row that has its own `(row-click)`, and one click should not do both.

`PopconfirmDirective` also exposes `isOpen` (a signal), `open()`, `close()` and `dismiss()`
(close **and** emit `cancelled`).

---

## Panels that come with a control

These are overlays too, and they need the same stylesheet. They are documented with their controls
in the **rlb-inputs** and **rlb-data-display** skills:

| Panel | Control | Skill |
|---|---|---|
| Calendar | `rlb-datepicker`, `rlb-date-range` | rlb-inputs |
| Clock | `rlb-time-picker` | rlb-inputs |
| Tree | `rlb-tree-select` | rlb-inputs |
| Command list | `rlb-command-palette` | rlb-data-display |

`DATE_PICKER_POSITIONS` is exported for reuse if you build a panel of your own that should sit where
the datepicker's does.

---

## Panels opened inside a modal or an offcanvas

**Nothing to configure — it already works.** It is worth knowing why, because the failure it fixes
looks like a bug in your code.

Bootstrap traps focus in an open dialog by watching `focusin` on the document and pulling anything
outside the dialog straight back in. Every panel here is rendered by the CDK at the end of the body,
which is *outside* the dialog — so a menu opened from inside a modal would take focus for an instant
and have it yanked away again. The menu opens, and the keyboard cannot reach it.

`RlbDialogOverlayScope` (root-provided) moves the CDK overlay container **into** the open dialog for
as long as it is open, which makes those panels part of what the trap considers inside. The
container is `position: fixed` and the dialog sets no transform of its own, so nothing about where
the panels land changes. Dialogs stack: the container follows the topmost one and returns to the
body when the last closes.

```html
<!-- Inside a modal or an offcanvas. No extra inputs, no z-index fights. -->
<rlb-dropdown>
  <button rlb-button rlb-dropdown>A dropdown</button>
  <ul rlb-dropdown-menu>…</ul>
</rlb-dropdown>
<rlb-datepicker timezone="Europe/Rome" [(ngModel)]="day" />
<rlb-tree-select [nodes]="nodes" [(ngModel)]="picked" />
```

If you write your own CDK overlay and want it to behave the same inside a dialog, you do not need to
do anything either — it shares the one overlay container.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| Every panel opens in the top-left corner | `@angular/cdk/overlay-prebuilt.css` is not in `angular.json`. |
| A popover never appears, and the button looks odd | `popover="…"` written statically. It is also the native HTML `popover` attribute. Bind it: `[popover]="'…'"`. |
| A filter menu closes on the first tick | `auto-close="outside"` is missing. |
| A split button's menu hangs off the side | `anchor="parent"` is missing on the toggle. |
| A menu is cut off inside a scrolling panel | That was the old Bootstrap behaviour; if you still see it, the element is not an `rlb-dropdown` — check the selector is one of the three supported host elements. |
| Bootstrap throws on a keypress in a menu | A custom key handler on `.dropdown-menu` that does not stop the event before Bootstrap's capture-phase handler sees it. |
