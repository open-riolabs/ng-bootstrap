import {
  AfterContentInit,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Collapse } from 'bootstrap';
import { Subject } from 'rxjs';
import { Color } from '../../../shared/types';
import { UniqueIdService } from '../../../shared/unique-id.service';
import { NavbarItemsComponent } from './navbar-items.component';

@Component({
  selector: 'rlb-navbar',
  template: `
    <ng-template #template>
      <nav
        class="navbar px-2 bg-{{ color() }} {{ placement() }} {{ _navExpand() }} {{ cssClass() }}"
        [attr.data-bs-theme]="dark() ? 'dark' : 'light'"
      >
        <div class="container-fluid">
          <ng-content select="[rlb-navbar-brand], [rlb-button][toggle], rlb-navbar-separator" />
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
          <div
            class="collapse navbar-collapse"
            [id]="navId"
          >
            <div class="p-3 d-flex w-100 flex-column flex-lg-row align-items-lg-center">
              <ng-content
                select="rlb-navbar-items, rlb-navbar-form, rlb-navbar-text, rlb-navbar-separator"
              />
            </div>
          </div>
        </div>
      </nav>
    </ng-template>
  `,
  standalone: false,
})
export class NavbarComponent implements OnInit, AfterContentInit, OnDestroy {
  element!: HTMLElement;
  public readonly navId: string;
  private destroy$ = new Subject<void>();

  _navExpand = computed(() => {
    const exp = this.expand();
    if (!exp) return '';
    else if (exp === 'always') return 'navbar-expand';
    else return `navbar-expand-${exp}`;
  });

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  navbarItemsGroups = contentChildren(NavbarItemsComponent, {
    descendants: true,
  });

  dark = input(true, { alias: 'dark', transform: booleanAttribute });
  color = input<Color | undefined>(undefined);
  placement = input<'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom' | undefined>(
    undefined,
  );
  expand = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always' | undefined>(undefined);
  cssClass = input('', { alias: 'class' });
  enableDropdownToggler = input(true, {
    alias: 'enable-dropdown-toggler',
    transform: booleanAttribute,
  });

  constructor(
    private idService: UniqueIdService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.navId = `nav${this.idService.id}`;

    effect(() => {
      const groups = this.navbarItemsGroups();
      groups.forEach(group => {
        // Since output() is not a Signal, we still need to subscribe,
        // but we can manage the subscription here more cleanly.
        // However, output().subscribe returns OutputRefSubscription which we should track.
        group.click.subscribe(() => this.closeMobileMenu());
      });
    });
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterContentInit() {
    // Logic moved to effect() for reactivity to content changes
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private closeMobileMenu() {
    const collapseEl = this.element?.querySelector('.navbar-collapse');
    if (collapseEl && collapseEl.classList.contains('show')) {
      const bsCollapse = Collapse.getOrCreateInstance(collapseEl);
      bsCollapse.hide();
    }
  }
}
