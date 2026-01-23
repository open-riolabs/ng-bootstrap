import { Component } from '@angular/core';
import { ToastDirective } from "../../../toast/toast.directive";
import { IToast } from "../../../toast/data/toast";
import { ToastData } from "../../../toast/data/toast-data";

import { RlbBootstrapModule } from "../../../../rlb-bootstrap.module";

@Component({
  template: `
    <div class="toast-header">
      <strong class="me-auto">{{data.title}}</strong>
      @if (data.subtitle) {
        <small> {{data.subtitle }}</small>
      }
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">{{data.content}}</div>
    `,
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
  standalone: true,
  imports: [RlbBootstrapModule]
})
export class CalendarToastComponent implements IToast<string, void> {
  data!: ToastData<string>;
  valid?: boolean = true;
  result?: any;
}

