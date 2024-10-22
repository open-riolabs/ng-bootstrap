import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './placeholder.component.html',
})
export class PlaceholdersComponent {

  html: string = `<div rlb-placeholder>
    <span>Testo</span>
</div>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './placeholder.component.html',
})
export class PlaceholdersComponent {}`;
}
