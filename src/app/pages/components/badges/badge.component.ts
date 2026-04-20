import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  imports: [SHARED_IMPORTS],
})
export class BadgesComponent {
  sample: string = `<button rlb-button class="position-relative" badge="pippo">Toggle</button>`;

  pill: string = `<button rlb-button class="position-relative" badge="pippo" [badge-pill]="true">Toggle</button>`;

  start: string = `<button rlb-button class="position-relative" badge="pippo" [badge-start]="100">Toggle</button>`;

  top: string = `<button rlb-button class="position-relative" badge="pippo" [badge-top]="100">Toggle</button>`;

  border: string = `<button rlb-button class="position-relative" badge="pippo" [badge-border]="true">Toggle</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './badge.component.html',
})
export class BadgesComponent {}`;
}
