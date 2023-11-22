import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      <a href="#" class="item" [class.active]="active">
        <i [class]='icon'></i>
        <span class="name">
          <ng-content></ng-content>    
      </span>
      </a>
    </ng-template>
    `
})
export class SidebarItemComponent implements OnInit {

  open: boolean = false;
  sidebarId: string = '';

  @Input('title') title!: string;
  @Input('icon') icon!: string;
  @Input('active') active: boolean = false;

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}