import { Component } from '@angular/core';

@Component({
    selector: 'h*[rlb-card-title]',
    template: `<ng-content />`,
    host: { class: 'card-title' },
    standalone: false
})
export class CardTitleComponent {}
