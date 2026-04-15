import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'h*[rlb-card-title]',
    template: `<ng-content />`,
    host: { class: 'card-title' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTitleComponent {}
