import { Component } from '@angular/core';

@Component({
    selector: 'app-offcanvas',
    templateUrl: './offcanvas.component.html',
    standalone: false
})
export class OffcanvassComponent {

  message: number = 0;

  onStatusChenged(event: any, i: number) {
     this.message++;
  }

  sample: string = `<button rlb-button toggle="offcanvas" toggle-target="off-1" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-1">
  <rlb-offcanvas-header>Offcanvas Header</rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  placement: string = `<button rlb-button toggle="offcanvas" toggle-target="off-2" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-2" [placement]="'end'">
  <rlb-offcanvas-header>Offcanvas Header</rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  responsive: string = `<button rlb-button toggle="offcanvas" toggle-target="off-3" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-3" [responsive]="'sm'">
  <rlb-offcanvas-header>Offcanvas Header</rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  cm: string = `<button rlb-button toggle="offcanvas" toggle-target="off-4" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-4" [close-manual]="false">
  <rlb-offcanvas-header>Offcanvas Header</rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  sc: string = `<button rlb-button toggle="offcanvas" toggle-target="off-5" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-5" (statusChange)="onStatusChenged($event, 0)">
  <rlb-offcanvas-header>Offcanvas Header</rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body {{message}}</rlb-offcanvas-body>
</rlb-offcanvas>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './offcanvas.component.html',
})
export class OffcanvassComponent {}`;
}
