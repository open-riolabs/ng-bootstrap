import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rlb-offcanvas-body',
    template: `<ng-content></ng-content>`,
    host: { class: 'offcanvas-body' },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffcanvasBodyComponent {}
