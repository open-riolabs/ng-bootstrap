import { Component } from '@angular/core';
import { ToastDirective } from "../../../toast/toast.directive";
import { IToast } from "../../../toast/data/toast";
import { ToastData } from "../../../toast/data/toast-data";
import { CommonModule } from "@angular/common";
import { RlbBootstrapModule } from "../../../../rlb-bootstrap.module";

@Component({
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
  ],
  standalone: true,
  imports: [CommonModule, RlbBootstrapModule]
})
export class CalendarToastComponent implements IToast<string, void> {
  data!: ToastData<string>;
  valid?: boolean = true;
  result?: any;
}

