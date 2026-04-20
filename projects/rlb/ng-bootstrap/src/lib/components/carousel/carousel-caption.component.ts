import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'rlb-carousel-caption',
    template: `
    <ng-content></ng-content>
  `,
    host: { class: 'carousel-caption' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselCaptionComponent {}
