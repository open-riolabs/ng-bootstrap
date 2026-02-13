import { Component, EmbeddedViewRef, OnInit, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rlb-dt-loading',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>`,
  standalone: false
})
export class DataTableLoadingComponent implements OnInit {

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');
  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
