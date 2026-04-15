import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltips.component.html',
  imports: [SHARED_IMPORTS],
})
export class TooltipssComponent {
  html: string = `<button rlb-button color="primary" [tooltip]="'Ciao'">Show Tooltips</button>
<br><br>
<button rlb-button color="primary" [popover]="'Ciao'">Show Popover</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './tooltips.component.html',
})
export class TooltipssComponent {}`;
}
