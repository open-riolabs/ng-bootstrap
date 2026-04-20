import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  imports: [SHARED_IMPORTS],
})
export class OptionsComponent {
  html: string = `<rlb-option>text</rlb-option>`;
}
