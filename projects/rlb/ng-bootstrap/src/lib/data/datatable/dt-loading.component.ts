import { Component, EmbeddedViewRef, Input, TemplateRef, ViewChild, ViewContainerRef, numberAttribute } from '@angular/core';

@Component({
  selector: 'rlb-dt-loading',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>`,
})
export class DataTableLoadingComponent {

  element!: HTMLElement;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
