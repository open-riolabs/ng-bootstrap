import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      <a href="#" class="item">
        <i class='bx bx-grid-alt nav_icon'></i>
        <span class="nav_name">{{title}}</span>
      </a>
    </ng-template>
    `
})
export class SidebarItemComponent implements OnInit {

  open: boolean = false;
  sidebarId: string = '';

  @Input('title') title!: string;
  @Input('icon') icon!: string;

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}