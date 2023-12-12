import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Breadcrumb } from './breadcrumb.data';

@Component({
  selector: 'rlb-c-breadcrumb',
  template: `
  <ng-template #template>
    <rlb-breadcrumb [divider]="data?.divider" [items]="data?.items" />
  </ng-template>`
})
export class BreadcrumbComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Breadcrumb | undefined;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}
