import { Component } from '@angular/core';
import {
  DateTz,
  IDateTz,
  ModalService,
  ToastService,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent {
  constructor(
    private modals: ModalService,
    private toasts: ToastService,
  ) { }

  number: number = 0;
  dtz?: IDateTz =  DateTz.now();
  str: string = 'Hello World!';
}

