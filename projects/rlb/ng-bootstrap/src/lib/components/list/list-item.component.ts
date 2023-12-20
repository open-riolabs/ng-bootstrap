import { Component, Input, TemplateRef, ViewChild, ViewContainerRef, booleanAttribute } from "@angular/core";

@Component({
  selector: 'rlb-list-item',
  template: `
  <ng-template #template>
    <li class="list-group-item"
      [class.disabled]="disabled" 
      [class.list-group-item-action]="action" 
      [class.active]="active"
      [attr.aria-current]="active">
      <ng-content></ng-content>
    </li>
  </ng-template>`,
  host: {

  },
})
export class ListItemComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active?: boolean
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean
  @Input({ transform: booleanAttribute, alias: 'action' }) action?: boolean

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {
  }
  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}