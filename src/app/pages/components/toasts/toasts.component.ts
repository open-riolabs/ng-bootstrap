import { Component } from '@angular/core';
import { ToastService } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';
import { ToastSampleComponent } from './toasts-sample.component';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS, ToastSampleComponent],
})
export class ToastsComponent {
  constructor(private toasts: ToastService) {}

  openToast(): void {
    this.toasts
      .openToast('toast-c-1', 'sample-toast', {
        title: 'Demo',
        content: 'This is a demo toast',
        ok: 'OK',
        subtitle: 'This is a subtitle',
        type: 'error',
      })
      .subscribe(o => {
        console.log('closed sub', o);
      });
  }

  basicExample = `<rlb-toast-container id="toast-c-1" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11" />

<button rlb-button (click)="openToast()">Open Toast</button>`;

  registrationExample = `// In your application providers (app.config.ts or a module):
providers: [
  {
    provide: ToastRegistryOptions,
    useValue: {
      toasts: {
        'sample-toast': ToastSampleComponent,
      },
    },
    multi: true,
  },
]`;

  toastComponentExample = `@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-toast',
  template: \`
    <div class="toast-header">
      <strong class="me-auto">{{ data().title }}</strong>
      @if (data().subtitle) {
        <small>{{ data().subtitle }}</small>
      }
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">{{ data().content }}</div>
  \`,
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ToastSampleComponent implements IToast<any, any> {
  data!: Signal<ToastData<any>>;
  valid?: boolean = true;
  result?: any;
}`;

  containerApi: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier for this container. Must match the containerId passed to ToastService.openToast().',
      kind: 'Input',
    },
  ];

  serviceApi: DocApiRow[] = [
    {
      name: 'openToast(containerId, name, data, options?)',
      type: 'Observable<ToastResult<Output> | null>',
      description:
        'Programmatically open a toast in the container identified by containerId. name is the registry key of the toast component. data provides the title, content and other display data. Returns an Observable that emits the ToastResult when the toast is dismissed.',
      kind: 'Method',
    },
  ];

  directiveApi: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier for this toast instance (injected automatically by the service).',
      kind: 'Input',
    },
    {
      name: 'data-instance',
      type: 'IToast',
      description: 'Reference to the IToast component instance (injected automatically by the service).',
      kind: 'Input',
    },
    {
      name: 'data-options',
      type: 'ToastOptions',
      default: '{}',
      description: 'Optional display options: animation, autohide, delay, color and extra CSS classes.',
      kind: 'Input',
    },
  ];
}
