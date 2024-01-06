import { Component } from '@angular/core';

@Component({
  selector: 'rlb-carousel-slide',
  template: ` <ng-content></ng-content>
    <ng-content select="rlb-carousel-caption"></ng-content>`,
  host: { class: 'carousel-item' },
})
export class CarouselSlideComponent {}
