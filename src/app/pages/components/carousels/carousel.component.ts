import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class CarouselsComponent {
  current = 0;

  basicExample = `<rlb-carousel [interval]="4000" [(current-slide)]="current">
  <rlb-carousel-slide [active]="true">
    <div class="ratio ratio-21x9 bg-primary text-white d-flex align-items-center justify-content-center">
      <span class="display-6">Slide one</span>
    </div>
    <rlb-carousel-caption>
      <h5>First slide</h5>
      <p>Some representative placeholder content.</p>
    </rlb-carousel-caption>
  </rlb-carousel-slide>

  <rlb-carousel-slide>
    <div class="ratio ratio-21x9 bg-success text-white d-flex align-items-center justify-content-center">
      <span class="display-6">Slide two</span>
    </div>
  </rlb-carousel-slide>

  <rlb-carousel-slide>
    <div class="ratio ratio-21x9 bg-dark text-white d-flex align-items-center justify-content-center">
      <span class="display-6">Slide three</span>
    </div>
  </rlb-carousel-slide>
</rlb-carousel>`;

  carouselApi: DocApiRow[] = [
    { name: 'id', type: 'string', description: 'Unique id for the carousel element. Auto-generated when omitted.', kind: 'Input' },
    { name: 'autoplay', type: "'auto' | 'manual' | 'none'", default: "'auto'", description: "Autoplay behaviour: 'auto' starts on load, 'manual' starts only after the first user interaction, 'none' disables autoplay.", kind: 'Input' },
    { name: 'interval', type: 'number', default: '500', description: 'Delay between automatic slide transitions, in milliseconds.', kind: 'Input' },
    { name: 'cross-fade', type: 'boolean', default: 'false', description: 'Animate slides with a fade transition instead of a slide.', kind: 'Input' },
    { name: 'hide-controls', type: 'boolean', default: 'false', description: 'Hide the previous and next control buttons.', kind: 'Input' },
    { name: 'hide-indicators', type: 'boolean', default: 'false', description: 'Hide the slide indicator buttons.', kind: 'Input' },
    { name: 'pause', type: "'hover' | false", default: "'hover'", description: "Pause autoplay when the pointer enters the carousel. Set to false to disable.", kind: 'Input' },
    { name: 'wrap', type: 'boolean', default: 'true', description: 'Cycle continuously; when false, stop at the last slide.', kind: 'Input' },
    { name: 'keyboard', type: 'boolean', default: 'true', description: 'Respond to arrow key events.', kind: 'Input' },
    { name: 'no-touch', type: 'boolean', default: 'false', description: 'Disable swipe/touch support.', kind: 'Input' },
    { name: 'current-slide', type: 'number', default: '0', description: 'Two-way bound zero-based index of the active slide.', kind: 'Two-way' },
    { name: 'slide', type: 'Carousel.Event', description: 'Emitted when a slide transition starts.', kind: 'Output' },
    { name: 'slid', type: 'Carousel.Event', description: 'Emitted when a slide transition completes.', kind: 'Output' },
    { name: 'slide-count', type: 'number', description: 'Emitted when the number of projected slides changes.', kind: 'Output' },
    { name: 'prev()', type: 'void', description: 'Navigate to the previous slide.', kind: 'Method' },
    { name: 'next()', type: 'void', description: 'Navigate to the next slide.', kind: 'Method' },
    { name: 'pause()', type: 'void', description: 'Pause the autoplay cycle.', kind: 'Method' },
    { name: 'cycle()', type: 'void', description: 'Resume the autoplay cycle.', kind: 'Method' },
    { name: 'to(index: number)', type: 'void', description: 'Navigate directly to a slide by zero-based index.', kind: 'Method' },
  ];

  slideApi: DocApiRow[] = [
    { name: 'active', type: 'boolean', default: 'false', description: 'Mark this slide as the initially visible slide.', kind: 'Input' },
    { name: 'id', type: 'string', default: "''", description: 'Optional id attribute for the slide element.', kind: 'Input' },
  ];

  captionApi: DocApiRow[] = [
    { name: '(default)', type: 'ng-content', description: 'Arbitrary HTML projected as the caption overlay inside a slide.', kind: 'Content' },
  ];
}
