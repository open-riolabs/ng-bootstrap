import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './card.component.html',
})
export class CardsComponent {

  html: string = `
  <rlb-card>
    <rlb-card-body>
      <h5>questo è un card body</h5>
      <p>questo è un paragrafo nel card body</p>
    </rlb-card-body>
    <rlb-card-footer>
      <p>questo è un card footer</p>
    </rlb-card-footer>
  </rlb-card>
  `;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './card.component.html',
})
export class CardsComponent {}`;
}
