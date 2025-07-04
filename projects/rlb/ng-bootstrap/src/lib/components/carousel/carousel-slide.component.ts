import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
    selector: 'rlb-carousel-slide',
    template: ` <ng-content></ng-content>
    <ng-content select="rlb-carousel-caption"></ng-content>`,
    host: {
        class: 'carousel-item',
        "[class.active]": 'active'
    },
    standalone: false
})
export class CarouselSlideComponent {
    @Input({ alias: 'active', transform: booleanAttribute }) active: boolean = false;
    @Input({ alias: 'id' }) id: string = '';
}