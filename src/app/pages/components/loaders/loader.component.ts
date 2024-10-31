import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './loader.component.html',
})
export class LoadersComponent {

  mmv: string = `<rlb-progress [min]="0" [max]="100" [value]="50"></rlb-progress>`;
  height: string = `<rlb-progress [height]="3"></rlb-progress>`;
  stripped: string = `<rlb-progress [striped]="true" [value]="50"></rlb-progress>`;
  infinite: string = `<rlb-progress [infinite]="true"></rlb-progress>`;

  style: string = `<rlb-spinner [style]="'grow'"></rlb-spinner>
<rlb-spinner [style]="'border'"></rlb-spinner>`;
  color: string = `<rlb-spinner [color]="'primary'"></rlb-spinner>
<rlb-spinner [color]="'secondary'"></rlb-spinner>
<rlb-spinner [color]="'success'"></rlb-spinner>
<rlb-spinner [color]="'danger'"></rlb-spinner>
<rlb-spinner [color]="'warning'"></rlb-spinner>
<rlb-spinner [color]="'info'"></rlb-spinner>
<rlb-spinner [color]="'light'"></rlb-spinner>
<rlb-spinner [color]="'dark'"></rlb-spinner>`;
  size: string = `<rlb-spinner [size]="'sm'"></rlb-spinner>
<rlb-spinner [size]="'md'"></rlb-spinner>
<rlb-spinner [size]="'lg'"></rlb-spinner>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './loader.component.html',
})
export class LoadersComponent {}`;
}
