import { Component, ContentChild, ContentChildren, DoCheck, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarItemComponent } from './sidebar-item.component';


@Component({
  selector: 'rlb-sidebar',
  template: `
    <ng-template #template>
      <div class="rlb-sidebar" [style.width.px]="open?maxWidth:width" [class.show]="open">
        <nav class="nav">
          <div>
            <ng-content select="rlb-sidebar-header"></ng-content>
            <div class="nav_list">
              <ng-content select="rlb-sidebar-item"></ng-content>
            </div>
          </div>
          <ng-content select="rlb-sidebar-footer"></ng-content>
        </nav>
      </div>
    </ng-template>
    `
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input('id') id!: string;
  @Input('max-width') maxWidth: number = 250;
  @Input('width') width: number = 68;
  @Input('open') open: boolean = false;


  @ContentChild(SidebarHeaderComponent) public header!: SidebarHeaderComponent
  @ContentChild(SidebarFooterComponent) public footer!: SidebarFooterComponent
  @ContentChildren(SidebarItemComponent) public items!: QueryList<SidebarItemComponent>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.header)
        this.header.open = changes['open'].currentValue;
      if (this.footer)
        this.footer.open = changes['open'].currentValue;
      if (this.items)
        this.items.forEach(item => item.open = changes['open'].currentValue);
    }
    if (changes['id']) {
      if (this.header)
        this.header.sidebarId = changes['id'].currentValue;
      if (this.footer)
        this.footer.sidebarId = changes['id'].currentValue;
      if (this.items)
        this.items.forEach(item => item.sidebarId = changes['id'].currentValue);
    }
  }
}