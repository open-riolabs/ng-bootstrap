import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  imports: [SHARED_IMPORTS],
})
export class RadiosComponent {
  value: string = '1';

  html: string = `
<rlb-radio [(ngModel)]="value">
  <rlb-option value="1">1</rlb-option>
  <rlb-option value="2">2</rlb-option>
  <rlb-option value="3">3</rlb-option>
</rlb-radio>`;
}
