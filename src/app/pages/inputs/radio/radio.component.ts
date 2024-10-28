import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './radio.component.html',
})
export class RadiosComponent {

  value: string = '1';

  html: string = `<rlb-radio [(ngModel)]="value">
  <rlb-option value="1">1</rlb-option>
  <rlb-option value="2">2</rlb-option>
  <rlb-option value="3">3</rlb-option>
</rlb-radio>`;
}
