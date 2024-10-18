import { Component } from '@angular/core';


@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
})
export class AccordionsComponent {

  onStatusChenged(event: any, i: number) {
     
  }

  html: string = `<rlb-accordion>
    <div rlb-accordion-item (statusChange)="onStatusChenged($event, 1)">
      <rlb-accordion-header>Header</rlb-accordion-header>
      <div rlb-accordion-body>
        Body
      </div>
    </div>
    <div rlb-accordion-item (statusChange)="onStatusChenged($event, 2)">
      <rlb-accordion-header>Header</rlb-accordion-header>
      <div rlb-accordion-body>
        Body
      </div>
    </div>
    <div rlb-accordion-item (statusChange)="onStatusChenged($event, 3)">
      <rlb-accordion-header>Header</rlb-accordion-header>
      <div rlb-accordion-body>
        Body
      </div>
    </div>
  </rlb-accordion>`;

  ts: string = `@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
})
export class AccordionsComponent {

  onStatusChenged(event: any, i: number) {
    console.log(event + ' ' + i); 
  }
}`;
}
