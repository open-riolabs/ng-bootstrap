import { Component } from '@angular/core';

@Component({
    selector: 'h*[rlb-card-subtitle]',
    template: `<ng-content />`,
    host: { class: 'card-subtitle mb-2 text-body-secondary' },
    standalone: false
})
export class CardSubtitleComponent {}
