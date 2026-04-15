import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  imports: [SHARED_IMPORTS],
})
export class TabssComponent {
  html: string = `<rlb-tabs>
  <rlb-tab target="pippo">Pippo</rlb-tab>
  <rlb-tab target="pluto">Pluto</rlb-tab>
  <rlb-tab target="paperino">Paperino</rlb-tab>
</rlb-tabs>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './tab.component.html',
})
export class TabssComponent {}`;
}
