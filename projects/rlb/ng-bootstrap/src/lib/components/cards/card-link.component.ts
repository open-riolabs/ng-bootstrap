import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'a[rlb-card-link]',
    template: `<ng-content />`,
    host: { class: 'card-link' },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLinkComponent {}
