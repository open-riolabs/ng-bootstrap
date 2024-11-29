import { Component } from '@angular/core';

@Component({
    selector: 'p[rlb-card-text]',
    template: `<ng-content />`,
    host: { class: 'card-text' },
    standalone: false
})
export class CardTextComponent {}
