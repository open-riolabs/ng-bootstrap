import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { BreakpointService } from '../../shared/breakpoint.service';
import { SidebarService } from './sidebar.service';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

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
  `,
    host: {
        '[attr.data-bs-theme]': "dark() ? 'dark' : 'light'",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
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

  private setCollapsed(collapsed: boolean) {
    this.sidebarService.setCollapsed(collapsed);
  }
}
