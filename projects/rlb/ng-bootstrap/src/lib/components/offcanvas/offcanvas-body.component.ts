import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rlb-offcanvas-body',
    template: `<ng-content></ng-content>`,
    host: { class: 'offcanvas-body' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffcanvasBodyComponent {}
