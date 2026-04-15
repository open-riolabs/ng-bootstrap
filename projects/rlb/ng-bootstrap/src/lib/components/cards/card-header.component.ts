import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rlb-card-header',
    template: `<ng-content />`,
    host: { class: 'card-header' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent {}
