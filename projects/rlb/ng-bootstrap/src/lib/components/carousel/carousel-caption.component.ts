import { Component } from '@angular/core';

@Component({
    selector: 'rlb-carousel-caption',
    template: `<ng-content></ng-content>`,
    host: { class: 'carousel-caption' },
    standalone: false
})
export class CarouselCaptionComponent {}
