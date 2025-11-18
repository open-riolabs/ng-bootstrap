import { Component, EmbeddedViewRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'rlb-dt-noitems',
    template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>`,
    standalone: false
})
export class DataTableNoItemsComponent implements OnInit {

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
