import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  imports: [SHARED_IMPORTS],
})
export class FilesComponent {
  html: string = `<rlb-file></rlb-file>`;
}
