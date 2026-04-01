import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'p[rlb-card-text]',
    template: `<ng-content />`,
    host: { class: 'card-text' },
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTextComponent {}
