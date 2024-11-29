import { Component } from '@angular/core';

@Component({
    selector: 'a[rlb-card-link]',
    template: `<ng-content />`,
    host: { class: 'card-link' },
    standalone: false
})
export class CardLinkComponent {}
