import { Component, Input } from '@angular/core';

@Component({
    selector: 'button[rlb-button-close], a[rlb-button-close]',
    template: `<ng-content></ng-content>`,
    host: {
        class: 'btn-close',
        'attr.type': 'button',
        'attr.aria-label': 'Close',
    },
    standalone: false
})
export class ButtonCloseComponent {}
