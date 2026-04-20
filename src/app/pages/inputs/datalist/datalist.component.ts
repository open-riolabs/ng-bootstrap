import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  imports: [SHARED_IMPORTS],
})
export class DatalistsComponent {
  html: string = `<rlb-datalist></rlb-datalist>`;
}
