import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'rlb-sidebar',
	template: `
		<div class="vertical-menu" [class.d-none]="isCollapsed" [class.rounded-2]="rounded">
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
export class SidebarComponent {
  menu: any;
  data: any;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
	isCollapsed: boolean = false;
	
	@Input({ alias: 'rounded', required: false }) rounded: boolean = false

  constructor() {
  }
	
	toggleSidebar() {
		this.isCollapsed = !this.isCollapsed;
		const sidebar = document.getElementById('sidebar');
		const content = document.querySelector('.rlb-content') as HTMLElement;
		if (content) {
			content.classList.toggle('expanded', this.isCollapsed);
		}
		
		if (sidebar) {
			sidebar.classList.toggle('collapsed', this.isCollapsed);
		}
	}
}
