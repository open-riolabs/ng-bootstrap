# RLB ng-Bootstrap Modals Skill

You are an expert in the **@open-rlb/ng-bootstrap** modal system. Modals support programmatic opening via `ModalService` and declarative usage via the `[rlb-modal]` directive.

## Core Types

```typescript
type ModalCloseReason = 'ok' | 'cancel' | 'close';
type ModalType = 'success' | 'info' | 'warning' | 'error';

interface ModalOptions {
  backdrop?: boolean | 'static';  // 'static' = click outside doesn't close
  scrollable?: boolean;
  verticalcentered?: boolean;
  animation?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullscreen?: boolean | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  focus?: boolean;
  keyboard?: boolean;             // Esc key closes modal
}

interface ModalData<T = any> {
  data?: T;
}

interface ModalResult<T = any> {
  reason: ModalCloseReason;
  data?: T;
}
```

---

## ModalService — Programmatic API

```typescript
import { ModalService } from '@open-rlb/ng-bootstrap';

@Component({ ... })
export class MyComponent {
  constructor(private modal: ModalService) {}

  // Open a named modal (registered component)
  openCustomModal() {
    this.modal.openModal<InputData, OutputData>(
      'my-modal-name',
      { data: { userId: 42 } },
      { size: 'lg', verticalcentered: true }
    ).subscribe(result => {
      if (result.reason === 'ok') {
        console.log(result.data); // OutputData
      }
    });
  }

  // Simple info/alert modal
  showAlert() {
    this.modal.openSimpleModal(
      'Title',
      'Message body text.',
      'Optional header',
      'Close',          // ok button label
      'info'            // ModalType
    ).subscribe();
  }

  // Confirmation modal (ok + cancel)
  confirmDelete() {
    this.modal.openConfirmModal(
      'Delete item?',
      'This action cannot be undone.',
      'Confirm',        // header
      'Delete',         // ok label
      'Cancel',         // cancel label
      'warning'         // ModalType
    ).subscribe(result => {
      if (result.reason === 'ok') {
        this.deleteItem();
      }
    });
  }
}
```

---

## [rlb-modal] Directive — Declarative Usage

```html
<!-- Trigger button -->
<button rlb-button color="primary" (click)="myModal.show()">Open Modal</button>

<!-- Modal template -->
<div rlb-modal id="my-modal" [data-instance]="myModal" [data-options]="modalOptions">
  <div class="modal-header">
    <h5 class="modal-title">Modal Title</h5>
    <button type="button" class="btn-close" data-modal-reason="close"></button>
  </div>
  <div class="modal-body">
    Modal body content here.
  </div>
  <div class="modal-footer">
    <button rlb-button color="secondary" data-modal-reason="cancel">Cancel</button>
    <button rlb-button color="primary" data-modal-reason="ok">Confirm</button>
  </div>
</div>
```

```typescript
@Component({ ... })
export class MyComponent {
  myModal!: IModal;  // reference set by the directive
  modalOptions: ModalOptions = {
    size: 'md',
    backdrop: 'static',
    verticalcentered: true
  };
}
```

**Close reason attributes:** add `data-modal-reason="ok"`, `data-modal-reason="cancel"`, or `data-modal-reason="close"` to any button inside the modal to auto-close with that reason.

---

## Modal Events

Listen to Bootstrap modal lifecycle events on the modal element:

```typescript
// 'show.bs.modal' | 'shown.bs.modal' | 'hide.bs.modal' | 'hidden.bs.modal' | 'hidePrevented.bs.modal'
```

---

## Modal with Form

Pattern for a modal that collects data and returns it on confirm:

```typescript
@Component({
  template: `
    <div rlb-modal id="edit-modal" [data-instance]="modal">
      <div class="modal-header">
        <h5 class="modal-title">Edit User</h5>
        <button class="btn-close" data-modal-reason="close"></button>
      </div>
      <div class="modal-body">
        <form [formGroup]="form">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <rlb-input formControlName="name" [enable-validation]="true"></rlb-input>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button rlb-button color="secondary" data-modal-reason="cancel">Cancel</button>
        <button rlb-button color="primary" (click)="save()">Save</button>
      </div>
    </div>
  `
})
export class EditModalComponent {
  modal!: IModal;
  form = new FormGroup({ name: new FormControl('') });

  save() {
    if (this.form.valid) {
      this.modal.hide('ok');
    }
  }
}
```

---

## ModalOptions Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backdrop` | `boolean \| 'static'` | `true` | `'static'` prevents closing on backdrop click |
| `scrollable` | `boolean` | `false` | Modal body scrolls independently |
| `verticalcentered` | `boolean` | `false` | Vertically center modal |
| `animation` | `boolean` | `true` | Fade animation |
| `size` | `'sm'\|'md'\|'lg'\|'xl'` | `'md'` | Modal width |
| `fullscreen` | `boolean\|string` | `false` | Full-screen mode |
| `focus` | `boolean` | `true` | Auto-focus when opened |
| `keyboard` | `boolean` | `true` | Esc closes modal |

---

## Best Practices

1. Use `openConfirmModal()` for destructive actions — never skip a confirmation step.
2. Use `backdrop: 'static'` for forms where accidental close would lose data.
3. Subscribe to the modal result observable and handle all three reasons: `'ok'`, `'cancel'`, `'close'`.
4. For complex modals with forms, use the declarative `[rlb-modal]` approach and control close programmatically after validation.
5. Use `size: 'lg'` or `size: 'xl'` for forms with many fields; `size: 'sm'` for simple confirmations.
