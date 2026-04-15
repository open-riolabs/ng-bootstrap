import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-input-validation',
  templateUrl: './input-validation.component.html',
  imports: [SHARED_IMPORTS],
})
export class InputValidationsComponent {
  html: string = `<rlb-input-validation></rlb-input-validation>`;
}
