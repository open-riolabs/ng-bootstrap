import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-file-dnd',
  templateUrl: './filednd.component.html',
  imports: [SHARED_IMPORTS],
})
export class FileDndsComponent {
  html: string = `<rlb-file-dnd></rlb-file-dnd>`;
}
