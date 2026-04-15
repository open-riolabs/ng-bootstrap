import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'button[rlb-button-close], a[rlb-button-close]',
    template: `<ng-content></ng-content>`,
    host: {
        class: 'btn-close',
        'attr.type': 'button',
        'attr.aria-label': 'Close',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCloseComponent {}
