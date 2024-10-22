import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './badge.component.html',
})
export class BadgesComponent {

  html: string = `<button rlb-button class="position-relative" badge="pippo" [badge-start]="100" [badge-top]="0" [badge-color]="'info'" [badge-pill]="true">Toggle</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './badge.component.html',
})
export class BadgesComponent {}`;
}
