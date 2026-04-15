import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-card-body',
    template: ` <ng-content select="[rlb-card-title]" />
    <ng-content select="[rlb-card-subtitle]" />
    <ng-content select="[rlb-card-text],[rlb-card-link]" />
    <ng-content />`,
    host: {
        class: 'card-body',
        '[class.card-img-overlay]': 'overlay()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class CardBodyComponent {
  overlay = signal(false);
}
