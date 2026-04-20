import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  imports: [SHARED_IMPORTS],
})
export class ColorsComponent {
  html: string = `<rlb-color></rlb-color>`;
}
