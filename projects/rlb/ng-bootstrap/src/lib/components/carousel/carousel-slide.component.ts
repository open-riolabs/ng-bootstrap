import { booleanAttribute, Component, input } from '@angular/core';

@Component({
    selector: 'rlb-carousel-slide',
    template: ` <ng-content></ng-content>
    <ng-content select="rlb-carousel-caption"></ng-content>`,
    host: {
        class: 'carousel-item',
        "[class.active]": 'active()'
    },
    standalone: false
})
export class CarouselSlideComponent {
    active = input(false, { alias: 'active', transform: booleanAttribute });
    id = input('', { alias: 'id' });
}