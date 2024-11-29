import { Component } from '@angular/core';

@Component({
    selector: 'rlb-card-footer',
    template: `<ng-content />`,
    host: { class: 'card-footer' },
    standalone: false
})
export class CardFooterComponent {}
