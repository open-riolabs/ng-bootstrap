import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './list.component.html',
})
export class ListsComponent {

  html: string = 
  `<rlb-list>
    <rlb-list-item [active]="true">pippo</rlb-list-item>
    <rlb-list-item [active]="true">pluto</rlb-list-item>
    <rlb-list-item [active]="true">paperino</rlb-list-item>
  </rlb-list>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './list.component.html',
})
export class ListsComponent {}`;
}
