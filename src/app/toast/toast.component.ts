import { Component } from '@angular/core';
import {
  ToastData,
  ToastDirective,
  IToast,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  hostDirectives: [
    {
      directive: ToastDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ToastComponent implements IToast<any, any> {
  data!: ToastData<any>;
  valid?: boolean = true;
  result?: any;
}
