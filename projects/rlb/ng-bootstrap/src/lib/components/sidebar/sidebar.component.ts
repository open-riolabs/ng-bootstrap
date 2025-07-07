import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'rlb-sidebar',
  template: `<div class="vertical-menu">
  <div id="sidebar-menu" class="h-100 overflow-y-scroll">
    <ul class="metismenu list-unstyled" id="side-menu" #sideMenu >
      <ng-content select="rlb-sidebar-item"></ng-content>
    </ul>
  </div>
</div> `,
  standalone: false
})

/**
 * Sidebar component
 */
export class SidebarComponent {
  menu: any;
  data: any;
  @ViewChild('sideMenu') sideMenu!: ElementRef;

  constructor() {
  }
}
