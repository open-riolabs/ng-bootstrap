import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Badge } from './badge.data';

@Component({
  selector: 'rlb-c-badge',
  template: `
  <ng-template #template>
    <span rlb-badge [color]="data?.color || 'primary'" [pill]="data?.pill" [hidden-text]="data?.hiddenText"]> {{ data?.text }}</span>
  </ng-template>`
})
export class BadgeComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Badge | undefined;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }

}
