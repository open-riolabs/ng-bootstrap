import {
  booleanAttribute,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { BreakpointService } from '../../shared/breakpoint.service';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'rlb-sidebar',
  template: `
    <div
      class="vertical-menu"
      [class.rounded-2]="rounded()"
    >
      <div
        id="sidebar-menu"
        class="w-100 h-100 overflow-y-auto"
      >
        <ul
          class="metismenu list-unstyled"
          id="side-menu"
          #sideMenu
        >
          <ng-content select="rlb-sidebar-item"></ng-content>
        </ul>
      </div>
    </div>
    <div
      role="button"
      class="sidebar-toggle"
      [tooltip]="!isCollapsed() ? 'Hide' : 'Show'"
      [tooltip-placement]="!isCollapsed() ? 'top' : 'left'"
      [tooltip-class]="'sidebar-toggler-tooltip'"
      (click)="toggleSidebar()"
    >
      <i
        [class.bi-chevron-double-left]="!isCollapsed()"
        [class.bi-chevron-double-right]="isCollapsed()"
        class="bi "
      ></i>
    </div>
  `,
  host: {
    '[attr.data-bs-theme]': "dark() ? 'dark' : 'light'",
  },
  standalone: false,
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, OnDestroy {
  menu: any;
  data: any;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  isCollapsed = signal(false);
  dark = input(true, { alias: 'dark', transform: booleanAttribute });

  private subscription: Subscription = new Subscription();

  rounded = input(false, { alias: 'rounded', transform: booleanAttribute });
  private isMobile = toSignal(this.breakpointService.isMobile$);

  constructor(
    private sidebarService: SidebarService,
    private breakpointService: BreakpointService,
  ) {
    effect(() => {
      const mobile = this.isMobile();
      if (mobile !== undefined) {
        this.setCollapsed(mobile);
      }
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.sidebarService.itemClicked$.subscribe(() => {
        if (this.breakpointService.isMobile) {
          this.setCollapsed(true);
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSidebar() {
    this.setCollapsed(!this.isCollapsed());
  }

  private setCollapsed(collapsed: boolean) {
    this.isCollapsed.set(collapsed);

    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.rlb-content') as HTMLElement;

    content?.classList.toggle('expanded', collapsed);
    sidebar?.classList.toggle('collapsed', collapsed);
  }
}
