import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Alert } from './alert.data';

@Component({
  selector: 'rlb-c-alert',
  template: `
  <ng-template #template>
    <rlb-alert [color]="data?.color || 'primary'"> {{ data?.text }}</rlb-alert>
  </ng-template>`
})
export class AlertComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Alert | undefined;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }

}
