import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ToastData,
  ToastDirective,
  IToast,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-toast',
  template: `
  <div class="toast-header">
  <strong class="me-auto">{{data.title}}</strong>
  <small *ngIf="data.subtitle"> {{data.subtitle }}</small>
  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
<div class="toast-body">{{data.content}}</div>
`,
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ]
})
export class ToastSampleComponent implements IToast<any, any> {
  data!: ToastData<any>;
  valid?: boolean = true;
  result?: any;
}
