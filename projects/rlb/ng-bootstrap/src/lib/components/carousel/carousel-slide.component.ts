import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-carousel-slide',
    template: `
    <ng-content></ng-content>
    <ng-content select="rlb-carousel-caption"></ng-content>
  `,
    host: {
        class: 'carousel-item',
        '[class.active]': 'active()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class CarouselSlideComponent {
  active = input(false, { alias: 'active', transform: booleanAttribute });
  id = input('', { alias: 'id' });
}
