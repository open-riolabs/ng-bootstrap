import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './tooltips.component.html',
})
export class TooltipssComponent {

  html: string = `<button rlb-button color="primary" [tooltip]="'Ciao'">Show Tooltips</button>
<br><br>
<button rlb-button color="primary" [popover]="'Ciao'">Show Tooltips</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './tooltips.component.html',
})
export class TooltipssComponent {}`;
}
