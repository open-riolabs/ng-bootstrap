import { Component } from '@angular/core';

@Component({
    selector: 'rlb-card-body',
    template: ` <ng-content select="[rlb-card-title]" />
    <ng-content select="[rlb-card-subtitle]" />
    <ng-content select="[rlb-card-text],[rlb-card-link]" />
    <ng-content />`,
    host: {
        class: 'card-body',
        '[class.card-img-overlay]': 'overlay',
    },
    standalone: false
})
export class CardBodyComponent {
  overlay?: boolean = false;
}
