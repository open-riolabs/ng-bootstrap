import { Component } from '@angular/core';

@Component({
  selector: 'rlb-card-header',
  template: `<ng-content />`,
  host: { class: 'card-header' },
})
export class CardHeaderComponent {}
