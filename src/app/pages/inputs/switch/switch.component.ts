import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  imports: [SHARED_IMPORTS],
})
export class SwitchesComponent {
  html: string = `<rlb-switch></rlb-switch>`;
}
