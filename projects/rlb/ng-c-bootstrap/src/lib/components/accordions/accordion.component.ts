import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Accordion } from './accordion.data';

@Component({
  selector: 'rlb-c-accordion',
  template: ` <ng-template #template>
    <rlb-accordion [flush]="data?.flush" [always-open]="data?.alwaysOpen">
      <div rlb-accordion-item *ngFor="let item of data?.items">
        <h2 rlb-accordion-header>
          {{ item.title }}
        </h2>
        <div rlb-accordion-body>
          {{ item.content }}
        </div>
      </div>
    </rlb-accordion>
  </ng-template>`,
})
export class AccordionComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Accordion | undefined;
  element!: HTMLElement;
  @Input({ alias: 'class' }) cssClass?: string = '';
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
