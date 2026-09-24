---
name: rlb-modals
description: Expert guidance for the @open-rlb/ng-bootstrap modal system — ModalService.openModal/openSimpleModal/openConfirmModal, registering modal components with ModalRegistryOptions, the rlb-modal-container host, the [rlb-modal] host directive, ModalData/ModalResult/IModal shapes, the valid gate on OK, and dialog accessibility (aria-labelledby, focus restoration, panels opened inside a dialog). Use when opening, building, or configuring modals.
---

# RLB ng-Bootstrap Modals Skill

A modal here is a **registered component opened by name**. `ModalService` builds it into an
`rlb-modal-container` and gives you back an observable that completes when the dialog closes.

## Core types

```typescript
type ModalCloseReason = 'ok' | 'cancel' | 'close';
type ModalType = 'success' | 'info' | 'warning' | 'error';

// What you pass IN. `title` and `content` are REQUIRED.
interface ModalData<T = any> {
  title: string;
  content: T;
  type?: ModalType;
  ok?: string;       // OK button label
  cancel?: string;   // Cancel button label
}

// What you get BACK. The payload is `result`, not `data`.
interface ModalResult<T = void> {
  reason: ModalCloseReason;
  result: T;
}

// What a modal component implements.
interface IModal<Input = any, Output = any> {
  data: Signal<ModalData<Input>>;      // injected by the container
  valid?: boolean | Signal<boolean>;   // false blocks the OK button
  result?: Output;                     // what comes back in ModalResult.result
}

interface ModalOptions {
  backdrop?: boolean | 'static';  // 'static' = a click outside does not close
  scrollable?: boolean;
  verticalcentered?: boolean;     // one word, no camelCase
  animation?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullscreen?: boolean | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  focus?: boolean;
  keyboard?: boolean;             // Esc closes
}
```

⚠️ Earlier versions of this document described `ModalData` as `{ data?: T }` and `ModalResult` as
`{ reason, data? }`. Both were wrong, and code written against them does not compile: `ModalData`
requires `title` and `content`, and the result payload is `result`.

---

## Setting it up (once per app)

```typescript
// app.config.ts — register every modal component by name
import { ModalRegistryOptions } from '@open-rlb/ng-bootstrap';

providers: [
  provideRlbBootstrap(),
  {
    provide: ModalRegistryOptions,
    useValue: { modals: { 'sample-dialog': ModalSampleComponent } },
    multi: true,            // multi: the library registers its own under the same token
  },
];
```

```html
<!-- app.component.html — one container, near the root -->
<rlb-modal-container id="modal" />
```

`provideRlbBootstrap()` already registers `rlb-common` (used by `openSimpleModal` /
`openConfirmModal`), `rlb-search` and the calendar's dialogs.

---

## Opening one

```typescript
import { ModalService } from '@open-rlb/ng-bootstrap';
import { lastValueFrom } from 'rxjs';

private readonly modals = inject(ModalService);

async edit(user: User): Promise<void> {
  const result = await lastValueFrom(
    this.modals.openModal<User, User>(
      'sample-dialog',
      { title: 'Edit user', content: user, ok: 'Save', cancel: 'Discard', type: 'info' },
      { size: 'lg', verticalcentered: true, backdrop: 'static' },
    ),
  );

  if (result.reason === 'ok') {
    this.save(result.result);   // `result`, not `data`
  }
}
```

`openModal<Input, Output>(name, data, options?)` → `Observable<ModalResult<Output>>`.

### The two shortcuts

```typescript
// Informational: title, body, optional sub-header, OK label, type, options
this.modals.openSimpleModal('Info', 'Operation done.', undefined, 'OK', 'info').subscribe();

// Confirmation: adds a Cancel button
this.modals
  .openConfirmModal('Delete item?', 'This cannot be undone.', undefined, 'Delete', 'Cancel', 'warning')
  .subscribe(result => {
    if (result.reason === 'ok') this.deleteItem();
  });
```

Both take a trailing `options?: ModalOptions`. Note the argument order differs between them —
`openConfirmModal` inserts `cancel` before `type`.

⚠️ `type` is a **`ModalType`**: `'success' | 'info' | 'warning' | 'error'`. `'danger'` is a `Color`,
not a `ModalType`, and will not typecheck.

For a row-level «are you sure?», prefer `[rlb-popconfirm]` — a full-screen modal is the wrong size
of interruption for «delete this row». See the **rlb-overlays** skill.

---

## Writing a modal component

The component applies `ModalDirective` as a **host directive** and implements `IModal`.

```typescript
import { Component, Signal, model } from '@angular/core';
import { IModal, ModalDirective } from '@open-rlb/ng-bootstrap';

@Component({
  imports: [FormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ data().title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
    </div>
    <div class="modal-body">
      <input class="form-control" [(ngModel)]="result.name" />
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-modal-reason="cancel">
        {{ data().cancel ?? 'Cancel' }}
      </button>
      <button type="button" class="btn btn-primary" data-modal-reason="ok">
        {{ data().ok ?? 'OK' }}
      </button>
    </div>
  `,
  hostDirectives: [{ directive: ModalDirective, inputs: ['id', 'data-instance', 'data-options'] }],
})
export class ModalSampleComponent implements IModal<User, User> {
  data!: Signal<ModalData<User>>;   // set by the container
  valid = model(true);              // false disables closing with OK
  result?: User;                    // pre-seeded from data().content
}
```

Three things worth knowing:

- **`result` is pre-seeded.** On init the directive deep-copies `data().content` into
  `instance.result` (via `structuredClone`), or `{}` when there is no content. So an edit dialog can
  bind straight to `result` and hand back a modified copy without touching the original.
- **The dialog opens itself.** `ModalDirective` calls `show()` in `ngAfterViewInit` — the modal is
  open as soon as the component exists. `show()` and `hide(reason?)` live on the **directive**, not
  on `IModal`; reach them with a `viewChild(ModalDirective)` if you need to close from code.
- **`valid` gates OK only.** A button with `data-modal-reason="ok"` refuses to close while `valid`
  is `false` (a plain boolean or a signal). `cancel` and `close` always close. Use it for a form
  that must not be submitted half-filled — but say *why* on screen, or the button looks broken.

### Close-reason buttons

Put `data-modal-reason="ok" | "cancel" | "close"` on any button inside the modal and the directive
wires it up. There is no output to subscribe to for this.

---

## What the directive does for accessibility

- **It names the dialog.** The `.modal-title` element is given an id and referenced with
  `aria-labelledby`. Without a title a screen reader announces «dialog» and stops — so give every
  dialog an `<h5 class="modal-title">`. Anything you say yourself wins: an `aria-label` **or an
  `aria-labelledby`** already on the host is left alone, so you can point at your own heading.
  `rlb-offcanvas` does the same with `.offcanvas-title`.
- **Focus goes back where it came from.** The element that was focused when the modal was created is
  refocused on `hidden.bs.modal` — which is every way out: the buttons, Escape, a click on the
  backdrop. It used to happen on three paths out of five, so closing with the keyboard left you at
  the top of the page.
- **Panels opened inside it work.** Dropdowns, the datepicker, the time picker, the tree select and
  the popconfirm are drawn by the CDK at the end of the body, which is outside Bootstrap's focus
  trap. The overlay container is moved into the open dialog for as long as it is open. Nothing to
  configure; see **rlb-overlays** for the mechanism.

⚠️ **On a mobile breakpoint a modal with no `fullscreen` option becomes full-screen automatically.**
If you want a small dialog on a phone, pass `fullscreen: false` explicitly.

---

## Multi-step (wizard) modal

Put a **carousel driven as a controlled stepper** — or an `rlb-stepper` — in the `modal-body` and the
Back / Next / Finish buttons in the `modal-footer`.

```html
<div class="modal-header">
  <h5 class="modal-title">Create</h5>
  <button class="btn-close" data-modal-reason="close"></button>
</div>
<div class="modal-body" [formGroup]="form">
  <rlb-carousel autoplay="none" no-touch hide-controls hide-indicators
    [current-slide]="page()" (current-slideChange)="page.set($event)"
    (slide-count)="count.set($event)" id="wizard">
    <rlb-carousel-slide active><div formGroupName="step1"><!-- … --></div></rlb-carousel-slide>
    <rlb-carousel-slide><div formGroupName="step2"><!-- … --></div></rlb-carousel-slide>
  </rlb-carousel>
</div>
<div class="modal-footer">
  <button rlb-button [disabled]="page() === 0" (click)="prev()">Back</button>
  @if (page() < count() - 1) {
    <button rlb-button color="primary" [disabled]="currentStepInvalid()" (click)="next()">Next</button>
  } @else {
    <button rlb-button color="primary" [disabled]="form.invalid" data-modal-reason="ok">Finish</button>
  }
</div>
```

`rlb-stepper` (in **rlb-components**) is usually the better fit: it keeps every step in the DOM, so
nothing typed into step 1 is lost when step 2 shows, and it can refuse to advance past an invalid
step by itself.

---

## ModalOptions reference

| Option | Type | Default | Notes |
|---|---|---|---|
| `backdrop` | `boolean \| 'static'` | `true` | `'static'` prevents closing on a backdrop click. |
| `scrollable` | `boolean` | `false` | The body scrolls, the header and footer stay. |
| `verticalcentered` | `boolean` | `false` | |
| `animation` | `boolean` | `true` | `false` removes the `fade` class. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | |
| `fullscreen` | `boolean \| '<bp>-down'` | mobile: `true`, otherwise `false` | Left undefined it becomes `true` on a mobile breakpoint. |
| `focus` | `boolean` | `true` | |
| `keyboard` | `boolean` | `true` | Escape closes. |

`scrollable` and `verticalcentered` are re-applied reactively; the rest are read once when the
dialog is built.

---

## Best practices

1. `title` and `content` are required on `ModalData` — there is no `{ data: … }` shape.
2. Read `result.result`, and handle all three reasons: `'ok'`, `'cancel'`, `'close'`.
3. Give every dialog an `<h5 class="modal-title">`; it is what names it for a screen reader.
4. `backdrop: 'static'` for forms where an accidental click would lose typed data.
5. Use `valid` to block OK on an invalid form, and show the user why.
6. Bind editable fields to `result` — it is already a deep copy of `content`.
7. For a destructive action on a table row, reach for `[rlb-popconfirm]` instead.
8. One `rlb-modal-container` near the root is enough; do not put one per page.
9. Pass `fullscreen: false` if a dialog should stay small on a phone.
