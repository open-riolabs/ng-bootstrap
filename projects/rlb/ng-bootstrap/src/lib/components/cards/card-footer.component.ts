import { Component } from '@angular/core';

@Component({
  selector: 'rlb-card-footer',
  template: `<ng-content />`,
  host: { class: 'card-footer' },
})
export class CardFooterComponent {}
