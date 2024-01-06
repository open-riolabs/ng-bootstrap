import { Component } from '@angular/core';

@Component({
  selector: 'rlb-card-group',
  template: `<ng-content select="rlb-card" />`,
  host: { class: 'card-group' },
})
export class CardGroupComponent {
  overlay: boolean = false;
}
