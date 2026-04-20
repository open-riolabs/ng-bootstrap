import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rlb-card-footer',
    template: `<ng-content />`,
    host: { class: 'card-footer' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFooterComponent {}
