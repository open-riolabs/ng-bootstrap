import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
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
        class="w-100 h-100 overflow-y-auto d-flex flex-column"
      >
        <ul
          class="metismenu list-unstyled"
          id="side-menu"
          #sideMenu
        >
          <ng-content select="rlb-sidebar-item"></ng-content>
        </ul>
        <ng-content select="[rlb-sidebar-footer]"></ng-content>
      </div>
    </div>
  `,
    host: {
        '[attr.data-bs-theme]': "dark() ? 'dark' : 'light'",
        '[class.collapsed]': 'sidebarService.isCollapsed()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, OnDestroy {
  menu: any;
  data: any;
  sideMenu = viewChild<ElementRef>('sideMenu');
  dark = input(true, { alias: 'dark', transform: booleanAttribute });

  private subscription: Subscription = new Subscription();

  rounded = input(false, { alias: 'rounded', transform: booleanAttribute });

  /** Read by the host binding above, so it cannot be private. */
  protected sidebarService = inject(SidebarService);
  private breakpointService = inject(BreakpointService);

  private isMobile = toSignal(this.breakpointService.isMobile$);

  constructor() {
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

  private setCollapsed(collapsed: boolean) {
    this.sidebarService.setCollapsed(collapsed);
  }
}
