import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'rlb-tab',
  template: `
  <ng-template #template>
    <li class="nav-item" role="presentation">
      <button 
        class="nav-link" 
        type="button" 
        role="tab"
        [class.active]="active"
        [disabled]="disabled"
        toggle="tab"
        [attr.id]="target+'-rlb-tab'"
        [toggle-target]="target"
        [attr.aria-selected]="active">
          <ng-content></ng-content>
        </button>
    </li>
  </ng-template>`,
  host: {
    '[attr.class]': 'undefined',
    '[attr.id]': 'undefined'
  },
})
export class TabComponent {
  @Input() active!: boolean
  @Input() disabled!: boolean
  @Input({ alias: 'target', required: true }) target!: string


  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {
  }
  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}