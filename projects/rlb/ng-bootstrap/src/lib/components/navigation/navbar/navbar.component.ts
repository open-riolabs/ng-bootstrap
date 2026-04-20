import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  OutputRefSubscription,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Collapse } from 'bootstrap';
import { Color } from '../../../shared/types';
import { UniqueIdService } from '../../../shared/unique-id.service';
import { NavbarItemsComponent } from './navbar-items.component';
import { SidebarService } from '../../sidebar/sidebar.service';
import { ButtonComponent } from '../../buttons/buttons.component';
import { ToggleDirective } from '../../buttons/toggle.directive';

@Component({
    selector: 'rlb-navbar',
    template: `
    <ng-template #template>
      <nav
        class="navbar px-2 bg-{{ color() }} {{ placement() }} {{
          _navExpand()
        }} {{ cssClass() }}"
        [attr.data-bs-theme]="dark() ? 'dark' : 'light'"
      >
        <div class="container-fluid">
          @if (showSideBarToggler()) {
            <button
              class="sidebar-toggler me-3"
              type="button"
              rlb-button
              aria-label="Toggle sidebar"
              (click)="toggleSidebar()"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          }

          <ng-content
            select="[rlb-navbar-brand], [rlb-button][toggle], rlb-navbar-separator"
          />
          <!-- FOR CUSTOM ELEMENTS -->
          <ng-content select="[rlb-custom-navbar-items]" />
          @if (enableDropdownToggler()) {
            <button
              class="navbar-toggler"
              [class.d-none]="!enableDropdownToggler()"
              type="button"
              rlb-button
              toggle="collapse"
              [toggle-target]="navId"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
          }
          <div
            class="collapse navbar-collapse"
            [id]="navId"
          >
            <div
              class="d-flex w-100 flex-column flex-lg-row align-items-lg-center"
            >
              <ng-content
                select="rlb-navbar-items, rlb-navbar-form, rlb-navbar-text, rlb-navbar-separator"
              />
            </div>
          </div>
        </div>
      </nav>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonComponent, ToggleDirective],
})
export class NavbarComponent implements OnInit, AfterContentInit, OnDestroy {
  element!: HTMLElement;

  private idService = inject(UniqueIdService);
  private viewContainerRef = inject(ViewContainerRef);
  private sidebarService = inject(SidebarService);

  public readonly navId: string = `nav${this.idService.id}`;
  private groupClickSubs: OutputRefSubscription[] = [];

  _navExpand = computed(() => {
    const exp = this.expand();
    if (!exp) return '';
    else if (exp === 'always') return 'navbar-expand';
    else return `navbar-expand-${exp}`;
  });

  template = viewChild.required<TemplateRef<any>>('template');
  navbarItemsGroups = contentChildren(NavbarItemsComponent, {
    descendants: true,
  });

  dark = input(true, { alias: 'dark', transform: booleanAttribute });
  showSideBarToggler = input(true, { transform: booleanAttribute });
  color = input<Color | undefined>(undefined);
  placement = input<
    'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom' | undefined
  >(undefined);
  expand = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always' | undefined>(
    undefined,
  );
  cssClass = input('', { alias: 'class' });
  enableDropdownToggler = input(false, {
    alias: 'enable-dropdown-toggler',
    transform: booleanAttribute,
  });

  constructor() {
    effect(() => {
      this.groupClickSubs.forEach(s => s.unsubscribe());
      this.groupClickSubs = [];
      const groups = this.navbarItemsGroups();
      groups.forEach(group => {
        this.groupClickSubs.push(group.click.subscribe(() => this.closeMobileMenu()));
      });
    });
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterContentInit() {
    // Logic moved to effect() for reactivity to content changes
  }

  ngOnDestroy() {
    this.groupClickSubs.forEach(s => s.unsubscribe());
  }

  toggleSidebar() {
    const isSideBarCollapsed = this.sidebarService.isCollapsed();
    this.sidebarService.setCollapsed(!isSideBarCollapsed);
  }

  private closeMobileMenu() {
    const collapseEl = this.element?.querySelector('.navbar-collapse');
    if (collapseEl && collapseEl.classList.contains('show')) {
      const bsCollapse = Collapse.getOrCreateInstance(collapseEl);
      bsCollapse.hide();
    }
  }
}
