import { Component } from '@angular/core';
import { ToastService } from '@open-rlb/ng-bootstrap';


@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  standalone: false
})
export class ToastsComponent {
  constructor(private toasts: ToastService) {
  }

  openToast(): void {
    this.toasts
      .openToast('toast-c-1', 'sample-toast', {
        title: 'Demo',
        content: 'This is a demo toast',
        ok: 'OK',
        subtitle: 'This is a subtitle',
        type: 'error',
      })
      .subscribe((o) => {
        console.log('closed sub', o);
      });
  }

  html: string = `<button rlb-button (click)="openToast()" class="me-2">Open Modal</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './toasts.component.html',
})
export class ToastsComponent {
  constructor(private toasts: ToastService) {
  }

  openToast(): void {
    this.toasts
      .openToast('toast-c-1', 'sample-toast', {
        title: 'Demo',
        content: 'This is a demo toast',
        ok: 'OK',
        subtitle: 'This is a subtitle',
        type: 'error',
      })
      .subscribe((o) => {
        console.log('closed sub', o);
      });
  }`;

  init: string = `providers: [
    {
      provide: ToastRegistryOptions,
      useValue: {
        toasts: {
          "sample-toast": ToastSampleComponent
        }
      },
      multi: true,
    },
  ]`;

  toast: string = `@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-toast',
  template: \`
  <div class="toast-header">
  <strong class="me-auto">{{data.title}}</strong>
  <small *ngIf="data.subtitle"> {{data.subtitle }}</small>
  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
<div class="toast-body">{{data.content}}</div>
\`,
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ToastSampleComponent implements IToast<any, any> {
  data!: ToastData<any>;
  valid?: boolean = true;
  result?: any;
}
`;


}

