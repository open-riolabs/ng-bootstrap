import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  imports: [SHARED_IMPORTS],
})
export class TextareasComponent {
  html: string = `<rlb-textarea></rlb-textarea>`;
}
