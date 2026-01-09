import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'rlb-sidebar',
	template: `
		<div class="vertical-menu" [class.rounded-2]="rounded">
			<div id="sidebar-menu" class="w-100 h-100 overflow-y-auto">
				<ul class="metismenu list-unstyled" id="side-menu" #sideMenu>
					<ng-content select="rlb-sidebar-item"></ng-content>
				</ul>
			</div>
		</div>
		<div role="button"
				 class="sidebar-toggle"
				 [tooltip]="!isCollapsed ? 'Hide' : 'Show'"
				 [tooltip-placement]="!isCollapsed ? 'top' : 'left'"
				 [tooltip-class]="'sidebar-toggler-tooltip'"
				 (click)="toggleSidebar()">
			<i [class.bi-chevron-double-left]="!isCollapsed" [class.bi-chevron-double-right]="isCollapsed"
				 class="bi "></i>
		</div>
	`,
  standalone: false
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit {
  menu: any;
  data: any;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
	isCollapsed: boolean = false;

	@Input({ alias: 'rounded', required: false }) rounded: boolean = false

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkBreakpoint();
  }

  constructor() {
  }

  ngOnInit() {
    this.checkBreakpoint();
  }

  toggleSidebar() {
    this.setCollapsed(!this.isCollapsed);
  }

  private setCollapsed(collapsed: boolean) {
    this.isCollapsed = collapsed;

    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.rlb-content') as HTMLElement;

    content?.classList.toggle('expanded', collapsed);
    sidebar?.classList.toggle('collapsed', collapsed);
  }

  private checkBreakpoint() {
    const shouldCollapse = window.innerWidth <= 992;
    this.setCollapsed(shouldCollapse);
  }
}
