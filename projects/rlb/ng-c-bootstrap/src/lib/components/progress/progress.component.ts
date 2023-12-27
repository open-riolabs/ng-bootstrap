import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Progress } from './progress.data';

@Component({
  selector: 'rlb-c-progress',
  template: `
  <ng-template #template>
    <rlb-progress 
      [min]="data?.min || 0"
      [max]="data?.max || 100"
      [height]="data?.height || 20"
      [animated]="data?.animated || false"
      [striped]="data?.striped || false"
      [ariaLabel]="data?.ariaLabel || 'ariaLabel'"
      [showValue]="data?.showValue || false"
      [color]="data?.color || 'primary'"
      [textColor]="data?.textColor || 'light'"
      [value]="data?.value || 0"  >{{ data?.text }}</rlb-progress>
  </ng-template>`
})
export class ProgressComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Progress | undefined;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }

}
