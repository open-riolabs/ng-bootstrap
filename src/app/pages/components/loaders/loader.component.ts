import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './loader.component.html',
})
export class LoadersComponent {

  html: string =
  `<rlb-dt-loading>
      <rlb-progress class="w-100" color="danger" height="2" infinite></rlb-progress>
   </rlb-dt-loading>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './loader.component.html',
})
export class LoadersComponent {}`;
}
