import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  imports: [SHARED_IMPORTS],
})
export class RangesComponent {
  html: string = `<rlb-range></rlb-range>`;
}
