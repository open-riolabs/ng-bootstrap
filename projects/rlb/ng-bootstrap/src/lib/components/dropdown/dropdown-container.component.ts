import { Component, ElementRef, input } from '@angular/core';

@Component({
  selector: 'ul[rlb-dropdown-menu], rlb-dropdown-container',
  template: ` @if (isList) {
  <ng-content select="li[rlb-dropdown-item]" />
}
@if (!isList) {
  <ng-content />
}`,
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
  standalone: false
})
export class DropdownContainerComponent {
  isList: boolean = false;

  placement = input<'left' | 'right' | undefined>(undefined, { alias: 'placement' });
  placementSm = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-sm' });
  placementMd = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-md' });
  placementLg = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-lg' });
  placementXl = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-xl' });
  placementXxl = input<'left' | 'right' | undefined>(undefined, { alias: 'placement-xxl' });

  constructor(
    private elementRef: ElementRef,
  ) {
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'ul') {
      this.isList = true;
    }
  }
}
