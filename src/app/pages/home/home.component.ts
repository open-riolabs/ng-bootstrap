import { Component } from '@angular/core';
import {
  ModalService,
  ToastService,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private modals: ModalService,
    private toasts: ToastService,
  ) {}

  modal(): void {
    this.modals
      .openModal('demo-component', {
        title: 'Demo',
        content: 'This is a demo component',
        ok: 'OK',
        type: 'info',
      })
      .subscribe((o) => {
        console.log('closed sub', o);
      });
  }

  toast(): void {
    this.toasts
      .openToast('toast-c-1', 'toast-component', {
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
}
