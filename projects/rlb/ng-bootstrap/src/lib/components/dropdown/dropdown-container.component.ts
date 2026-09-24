import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { map } from 'rxjs';
import { RlbDropdownAlign, RlbDropdownHost } from './dropdown-host';

/** Bootstrap's breakpoints, largest first: the last one that matches wins. */
const BREAKPOINTS = [
  { key: 'xxl', query: '(min-width: 1400px)' },
  { key: 'xl', query: '(min-width: 1200px)' },
  { key: 'lg', query: '(min-width: 992px)' },
  { key: 'md', query: '(min-width: 768px)' },
  { key: 'sm', query: '(min-width: 576px)' },
] as const;

/**
 * The menu.
 *
 * The `dropdown-menu-*-end` classes are still written on the element, because they are what
 * Bootstrap's CSS and anyone's overrides look for — but the alignment is now decided in
 * TypeScript and handed to the overlay, since a menu the CDK has moved out of the document flow
 * cannot be aligned by a class on its own box. The breakpoint that class implied is read through
 * the CDK's `BreakpointObserver`, so `placement-lg` keeps meaning what it meant.
 */
@Component({
  selector: 'ul[rlb-dropdown-menu], rlb-dropdown-container',
  template: `
    <!--
      One slot, unfiltered. It used to take only li[rlb-dropdown-item], which silently dropped a
      plain <li> and anything rendered by a structural directive — an @for of actions reaches the
      menu as an ng-container, which matches no element selector at all.
    -->
    <ng-content />
  `,
  host: {
    class: 'dropdown-menu',
    '[class.dropdown-menu-end]': 'placement() === "right"',
    '[class.dropdown-menu-start]': 'placement() === "left"',
    '[class.dropdown-menu-sm-end]': 'placementSm() === "right"',
    '[class.dropdown-menu-sm-start]': 'placementSm() === "left"',
    '[class.dropdown-menu-md-end]': 'placementMd() === "right"',
    '[class.dropdown-menu-md-start]': 'placementMd() === "left"',
    '[class.dropdown-menu-lg-end]': 'placementLg() === "right"',
    '[class.dropdown-menu-lg-start]': 'placementLg() === "left"',
    '[class.dropdown-menu-xl-end]': 'placementXl() === "right"',
    '[class.dropdown-menu-xl-start]': 'placementXl() === "left"',
    '[class.dropdown-menu-xxl-end]': 'placementXxl() === "right"',
    '[class.dropdown-menu-xxl-start]': 'placementXxl() === "left"',
    '[style.border]': 'isList ? null : "none"',
    '[style.padding]': 'isList ? null : "0px"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownContainerComponent implements AfterContentInit {
  private elementRef = inject(ElementRef<HTMLElement>);
  private host = inject(RlbDropdownHost, { optional: true });

  isList: boolean = false;

  placement = input<'left' | 'right' | undefined>(undefined, { alias: 'placement' });
  placementSm = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-sm' });
  placementMd = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-md' });
  placementLg = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-lg' });
  placementXl = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-xl' });
  placementXxl = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-xxl' });

  private matched = toSignal(
    inject(BreakpointObserver)
      .observe(BREAKPOINTS.map(breakpoint => breakpoint.query))
      .pipe(map(state => state.breakpoints)),
    { initialValue: {} as Record<string, boolean> },
  );

  /** The placement in force at this width: the largest breakpoint that matches and says something. */
  readonly align = computed<RlbDropdownAlign>(() => {
    const perBreakpoint: Record<string, 'left' | 'right' | undefined> = {
      xxl: this.placementXxl(),
      xl: this.placementXl(),
      lg: this.placementLg(),
      md: this.placementMd(),
      sm: this.placementSm(),
    };

    const matched = this.matched();
    for (const breakpoint of BREAKPOINTS) {
      const placement = perBreakpoint[breakpoint.key];
      if (placement && matched[breakpoint.query]) return placement === 'right' ? 'end' : 'start';
    }

    return this.placement() === 'right' ? 'end' : 'start';
  });

  constructor() {
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'ul') {
      this.isList = true;
    }
  }

  ngAfterContentInit(): void {
    this.host?.registerMenu(this.elementRef.nativeElement, this.align);
  }
}
