import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './button.component.html',
})
export class ButtonsComponent {

  html: string = `<button rlb-button color="primary" [size]="'sm'">Search</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './button.component.html',
})
export class ButtonsComponent {}`;
}
