import { Component } from '@angular/core';
import { ModalService } from '@open-rlb/ng-bootstrap';
import { lastValueFrom } from 'rxjs';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-modal',
  templateUrl: './modals.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ModalsComponent {
  constructor(private modals: ModalService) {}

  // ── Example code strings ────────────────────────────────────────────────

  basicExample = `<button rlb-button (click)="modal()">Open Modal</button>`;

  setupExample = `// 1. Register modal components in your app providers
providers: [
  {
    provide: ModalRegistryOptions,
    useValue: {
      modals: {
        'sample-dialog': ModalSampleComponent,
      }
    },
    multi: true,
  },
]

// 2. Place a single <rlb-modal-container> in your root layout
// app.component.html
<rlb-modal-container id="modal" />`;

  dialogExample = `@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div [class]="'modal-header' + headerColor">
      <h5 class="modal-title">Modal title</h5>
      <button type="button" class="btn-close" aria-label="Close"
              data-modal-reason="close"></button>
    </div>
    <div class="modal-body">
      <p>Modal body text goes here.</p>
      <pre>{{ data() | json }}</pre>
      <input [(ngModel)]="result" />
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-modal-reason="cancel">Close</button>
      <button type="button" class="btn btn-primary"   data-modal-reason="ok">Save changes</button>
    </div>
  \`,
  hostDirectives: [{
    directive: ModalDirective,
    inputs: ['id', 'data-instance', 'data-options'],
  }],
})
export class ModalSampleComponent implements IModal<any, any> {
  data!: Signal<any>;
  valid = model(true);
  result?: any;

  get headerColor() {
    return this.data()?.type ? \` bg-\${this.data().type}\` : '';
  }
}`;

  openModalExample = `// Programmatic open — resolves when the modal is closed
async modal(): Promise<void> {
  const result = await lastValueFrom(
    this.modals.openModal('sample-dialog', {
      title: 'Demo',
      content: 'This is a demo component',
      ok: 'OK',
      type: 'success',
    })
  );
  console.log(result); // { reason: 'ok' | 'cancel' | 'close', result: any }
}`;

  optionsExample = `this.modals.openModal('sample-dialog', data, {
  size: 'lg',          // 'sm' | 'md' | 'lg' | 'xl'
  scrollable: true,
  verticalcentered: true,
  backdrop: 'static',  // true | false | 'static'
  keyboard: false,
  animation: true,
  fullscreen: 'lg-down',
});`;

  simpleModalExample = `// Simple informational modal
this.modals.openSimpleModal(
  'Info',            // title
  'Operation done.', // body
  undefined,         // optional sub-header
  'OK',              // ok button label
  'info',            // color type
);

// Confirm modal (adds a Cancel button)
this.modals.openConfirmModal(
  'Delete item?',
  'This action cannot be undone.',
  undefined,
  'Delete',
  'Cancel',
  'danger',
).subscribe(result => {
  if (result.reason === 'ok') { /* confirmed */ }
});`;

  // ── Live example handler ────────────────────────────────────────────────

  async modal(): Promise<void> {
    const o = await lastValueFrom(
      this.modals.openModal('sample-dialog', {
        title: 'Demo',
        content: 'This is a demo component',
        ok: 'OK',
        type: 'success',
      }),
    );
    console.log('closed', o);
  }

  // ── API tables ──────────────────────────────────────────────────────────

  containerApi: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Required unique identifier that links the container to modals opened with the same name. Place one container in your root layout.',
      kind: 'Input',
    },
  ];

  serviceApi: DocApiRow[] = [
    {
      name: 'openModal<Input, Output>(name, data, options?)',
      type: 'Observable<ModalResult<Output>>',
      description: 'Open a registered modal by name, passing ModalData. Emits once with { reason, result } when the modal closes.',
      kind: 'Method',
    },
    {
      name: 'openSimpleModal(title, body, header?, ok?, type?, options?)',
      type: 'Observable<ModalResult<void>>',
      description: 'Convenience method that opens the built-in rlb-common modal with a single OK button and no confirmation.',
      kind: 'Method',
    },
    {
      name: 'openConfirmModal(title, body, header?, ok?, cancel?, type?, options?)',
      type: 'Observable<ModalResult<void>>',
      description: 'Convenience method that opens the built-in rlb-common confirmation modal with OK and Cancel buttons.',
      kind: 'Method',
    },
  ];

  directiveApi: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Required. Unique identifier for this modal instance, injected via hostDirectives.',
      kind: 'Input',
    },
    {
      name: 'data-instance',
      type: 'IModal',
      description: 'Required. The host component instance implementing IModal; provides data(), valid and result to the directive.',
      kind: 'Input',
    },
    {
      name: 'data-options',
      type: 'ModalOptions',
      description: 'Optional display options (size, backdrop, scrollable, verticalcentered, fullscreen, animation, keyboard, focus).',
      kind: 'Input',
    },
    {
      name: 'show()',
      type: 'void',
      description: 'Programmatically show the modal.',
      kind: 'Method',
    },
    {
      name: 'hide(reason?)',
      type: 'void',
      description: 'Programmatically hide the modal and optionally set the close reason.',
      kind: 'Method',
    },
    {
      name: 'initButtons()',
      type: 'void',
      description: 'Re-scan the modal content for [data-modal-reason] buttons and attach click handlers.',
      kind: 'Method',
    },
  ];

  modalDataApi: DocApiRow[] = [
    {
      name: 'title',
      type: 'string',
      description: 'Modal title shown in the header.',
      kind: 'Input',
    },
    {
      name: 'type',
      type: 'ModalType',
      description: "Optional Bootstrap contextual color applied to the header (e.g. 'success', 'danger').",
      kind: 'Input',
    },
    {
      name: 'content',
      type: 'T',
      description: 'Arbitrary payload delivered to the modal component via data().',
      kind: 'Input',
    },
    {
      name: 'ok',
      type: 'string',
      description: "Label for the OK button. Used by built-in modals; ignored when a custom component handles its own buttons.",
      kind: 'Input',
    },
    {
      name: 'cancel',
      type: 'string',
      description: 'Label for the Cancel button. Used by built-in confirm modals.',
      kind: 'Input',
    },
  ];

  modalOptionsApi: DocApiRow[] = [
    {
      name: 'backdrop',
      type: "boolean | 'static'",
      default: 'true',
      description: "Click-outside behavior. 'static' prevents closing on backdrop click.",
      kind: 'Input',
    },
    {
      name: 'scrollable',
      type: 'boolean',
      description: 'Make the modal body independently scrollable.',
      kind: 'Input',
    },
    {
      name: 'verticalcentered',
      type: 'boolean',
      description: 'Vertically center the modal in the viewport.',
      kind: 'Input',
    },
    {
      name: 'animation',
      type: 'boolean',
      default: 'true',
      description: 'Enable or disable the Bootstrap fade animation.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      description: 'Constrain the dialog width with a Bootstrap size modifier.',
      kind: 'Input',
    },
    {
      name: 'fullscreen',
      type: "boolean | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down'",
      description: 'Force fullscreen mode unconditionally (true) or below a specific breakpoint.',
      kind: 'Input',
    },
    {
      name: 'focus',
      type: 'boolean',
      default: 'true',
      description: 'Put focus inside the modal after opening.',
      kind: 'Input',
    },
    {
      name: 'keyboard',
      type: 'boolean',
      default: 'true',
      description: 'Allow closing the modal with the Escape key.',
      kind: 'Input',
    },
  ];
}
