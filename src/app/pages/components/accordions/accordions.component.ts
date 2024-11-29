import { Component } from '@angular/core';


@Component({
    selector: 'app-accordions',
    templateUrl: './accordions.component.html',
    styleUrls: ['./accordions.component.scss'],
    standalone: false
})
export class AccordionsComponent {

  message: number = 0;

  onStatusChenged(event: any, i: number) {
     this.message++;
  }

  sample: string = `<rlb-accordion>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion>`;

flush: string = `<rlb-accordion [flush]="true">
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion>`;

ao: string = `<rlb-accordion [always-open]="false">
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion`;

expanded: string = `<rlb-accordion>
  <div rlb-accordion-item [expanded]="true">
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion>`;

  sc: string = `<p>{{message}}</p>
<rlb-accordion>
  <div rlb-accordion-item (statusChange)="onStatusChenged($event, 0)">
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion>`;

  ts: string = `@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
})
export class AccordionsComponent {

  message: number = 0;

  onStatusChenged(event: any, i: number) {
    this.message++;
  }
}`;
}
