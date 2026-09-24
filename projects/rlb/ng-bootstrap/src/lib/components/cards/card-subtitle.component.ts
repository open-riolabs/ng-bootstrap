import { ChangeDetectionStrategy, Component } from '@angular/core';

/*
  Every heading level, spelled out. The selector used to be `h*[rlb-card-subtitle]`, and `h*` is not
  a CSS selector: it matched no element at all, so this never applied its class to anything.
  The same went for .card-subtitle and its muted colour.
*/
const SELECTOR = 'h1[rlb-card-subtitle], h2[rlb-card-subtitle], h3[rlb-card-subtitle], h4[rlb-card-subtitle], h5[rlb-card-subtitle], h6[rlb-card-subtitle]';

@Component({
    selector: SELECTOR,
    template: `<ng-content />`,
    host: { class: 'card-subtitle mb-2 text-body-secondary' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSubtitleComponent {}
