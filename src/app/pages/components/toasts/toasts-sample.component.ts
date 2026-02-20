import { Component, input } from '@angular/core';
import { IToast, ToastData, ToastDirective } from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-toast',
  template: `
    <div class="toast-header">
      <strong class="me-auto">{{ data().title }}</strong>
      @if (data().subtitle) {
        <small>{{ data().subtitle }}</small>
      }
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
    <div class="toast-body">{{ data().content }}</div>
  `,
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ToastSampleComponent implements IToast<any, any> {
  data = input.required<ToastData<any>>();
  valid?: boolean = true;
  result?: any;
}
