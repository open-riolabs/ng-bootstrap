import { Component, ContentChild, ContentChildren, DoCheck, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarItemComponent } from './sidebar-item.component';


@Component({
  selector: 'rlb-sidebar',
  template: `
    <ng-template #template>
      <div class="rlb-side" [class.show]="open">
        <nav class="nav">
          <div>
            <ng-content select="rlb-sidebar-header"></ng-content>
            <div class="nav_list">
              <ng-content select="rlb-sidebar-item"></ng-content>
            </div>
          </div>
          <ng-content select="rlb-sidebar-footer"></ng-content>
          <!-- <a href="#" class="nav_link">
            <i class='bx bx-log-out nav_icon'></i>
            <span class="nav_name">SignOut</span>
          </a> -->
        </nav>
      </div>
    </ng-template>
    `
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input('id') id!: string;
  @Input('width') width: string = '250px';
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
    }
    if(changes['id']) {
      if (this.header)
        this.header.sidebarId = changes['id'].currentValue;
      if (this.footer)
        this.footer.sidebarId = changes['id'].currentValue;
    }
  }
}