import { Component, ContentChildren, DoCheck, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { ListItemComponent } from "./list-item.component";

@Component({
  selector: 'rlb-list',
  template: `
  <ng-template #template>
    <ul class="list-group" [class.list-group-numbered]="numbered" [class.list-group-flush]="flush" [class.list-group-horizontal]="horizontal">
      <ng-content select="rlb-list-item, rlb-list-item-image"></ng-content>
    </ul>
  </ng-template>`,
  host: {

  },
})
export class ListComponent implements DoCheck {
  @Input() disabled!: boolean
  @Input('numbered') numbered!: boolean
  @Input('flush') flush!: boolean
  @Input('horizontal') horizontal!: boolean

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  @ContentChildren(ListItemComponent) children!: QueryList<ListItemComponent>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngDoCheck() {
    this.children?.forEach(child => {
      child.disabled = this.disabled
    })
  }
}