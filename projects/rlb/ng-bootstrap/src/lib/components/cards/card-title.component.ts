import { ChangeDetectionStrategy, Component } from '@angular/core';

/*
  Every heading level, spelled out. The selector used to be `h*[rlb-card-title]`, and `h*` is not
  a CSS selector: it matched no element at all, so this never applied its class to anything.
  Bootstrap's .card-title margin has therefore never been on a card title.
*/
const SELECTOR = 'h1[rlb-card-title], h2[rlb-card-title], h3[rlb-card-title], h4[rlb-card-title], h5[rlb-card-title], h6[rlb-card-title]';

@Component({
    selector: SELECTOR,
    template: `<ng-content />`,
    host: { class: 'card-title' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTitleComponent {}
