import { Component } from '@angular/core';

@Component({
  selector: 'rlb-offcanvas-body',
  template: `<ng-content></ng-content>`,
  host: { class: 'offcanvas-body' },
})
export class OffcanvasBodyComponent {}
