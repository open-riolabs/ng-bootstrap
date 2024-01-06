import { Component } from '@angular/core';

@Component({
  selector: 'rlb-offcanvas-header',
  template: `
    <ng-content select="h*[rlb-offcanvas-title]"></ng-content>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
    ></button>
    <ng-content select=":not([rlb-offcanvas-title])"></ng-content>
  `,
  host: { class: 'offcanvas-header' },
})
export class OffcanvasHeaderComponent {}
