import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './offcanvas.component.html',
})
export class OffcanvassComponent {

  html: string = `<button rlb-button toggle="offcanvas" toggle-target="off-1" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-1">
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Offcanvas</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body> pippo </rlb-offcanvas-body>
</rlb-offcanvas>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './offcanvas.component.html',
})
export class OffcanvassComponent {}`;
}
