import { Component } from '@angular/core';

@Component({
    selector: 'app-tab',
    templateUrl: './tab.component.html',
    standalone: false
})
export class TabssComponent {

  html: string = `<rlb-tabs>
  <rlb-tab target="pippo">Pippo</rlb-tab>
  <rlb-tab target="pluto">Pluto</rlb-tab>
  <rlb-tab target="paperino">Paperino</rlb-tab>
</rlb-tabs>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './tab.component.html',
})
export class TabssComponent {}`;
}
