import { Component, Input } from '@angular/core';

@Component({
    selector: 'rlb-carousel-slide',
    template: ` <ng-content></ng-content>
    <ng-content select="rlb-carousel-caption"></ng-content>`,
    host: {
        class: 'carousel-item',
        "[class.active]": 'classActive'

    },
    standalone: false
})
export class CarouselSlideComponent {
    active: boolean = true;
    classActive: boolean = true;
    @Input({ alias: 'id' }) id: string = '';
}
