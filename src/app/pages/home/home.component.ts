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
  ) { }

  coso: any = '3'

  modal(): void {
    this.modals
      .openModal('demo-component', {
        title: 'Demo',
        content: 'This is a demo component',
        ok: 'OK',
        type: 'success',
      })
      .subscribe((o) => {
        console.log('closed sub', o);
      });


    this.modals.openSimpleModal('Demo', 'This is a demo simple modal')
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

  public pippo: boolean = false;
  public pippos: any[] = [
    { name: 'pippo', value: 1 },
    { name: 'pluto', value: 2 },
    { name: 'paperino', value: 3 },
  ];

  get pipposFiltered(): any[] {
    return this.pippos.filter((p) => this.pippo || p.value > 1);
  }

  setCoso() {
    this.coso = '2'
  }

  log(e: any) {
    console.log('log', e)
  }
}

