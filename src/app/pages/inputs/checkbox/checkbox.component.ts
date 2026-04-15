import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [SHARED_IMPORTS],
})
export class CheckboxsComponent {
  html: string = `<rlb-checkbox></rlb-checkbox>`;
}
