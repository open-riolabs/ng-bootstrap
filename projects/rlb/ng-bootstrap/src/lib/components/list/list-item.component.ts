import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

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
  @Input() active!: boolean
  @Input() disabled!: boolean
  @Input('action') action!: boolean

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }
  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}