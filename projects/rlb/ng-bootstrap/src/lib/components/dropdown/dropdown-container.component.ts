import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'ul[rlb-dropdown-menu], rlb-dropdown-container',
  template: ` <ng-content *ngIf="isList" select="li[rlb-dropdown-item]" />
    <ng-content *ngIf="!isList" />`,
  host: {
    class: 'dropdown-menu',
    '[class.dropdown-menu-end]': 'placement === "right"',
    '[class.dropdown-menu-start]': 'placement === "left"',
    '[class.dropdown-menu-sm-end]': 'placementSm === "right"',
    '[class.dropdown-menu-sm-start]': 'placementSm === "left"',
    '[class.dropdown-menu-md-end]': 'placementMd === "right"',
    '[class.dropdown-menu-md-start]': 'placementMd === "left"',
    '[class.dropdown-menu-lg-end]': 'placementLg === "right"',
    '[class.dropdown-menu-lg-start]': 'placementLg === "left"',
    '[class.dropdown-menu-xl-end]': 'placementXl === "right"',
    '[class.dropdown-menu-xl-start]': 'placementXl === "left"',
    '[class.dropdown-menu-xxl-end]': 'placementXxl === "right"',
    '[class.dropdown-menu-xxl-start]': 'placementXxl === "left"',
  },
})
export class DropdownContainerComponent {
  isList: boolean = false;

  @Input({ alias: 'placement' }) public placement: 'bottom' | 'left' | 'right' = 'bottom';
  @Input({ alias: 'placement-sm' }) public placementSm: 'bottom' | 'left' | 'right' = 'bottom';
  @Input({ alias: 'placement-md' }) public placementMd: 'bottom' | 'left' | 'right' = 'bottom';
  @Input({ alias: 'placement-lg' }) public placementLg: 'bottom' | 'left' | 'right' = 'bottom';
  @Input({ alias: 'placement-xl' }) public placementXl: 'bottom' | 'left' | 'right' = 'bottom';
  @Input({ alias: 'placement-xxl' }) public placementXxl: 'bottom' | 'left' | 'right' = 'bottom';

  constructor(
    private elementRef: ElementRef,
    renderer: Renderer2,
  ) {
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'ul') {
      this.isList = true;
    } else {
      renderer.setStyle(this.elementRef.nativeElement, 'border', 'none');
      renderer.setStyle(this.elementRef.nativeElement, 'padding', '0px');
    }
  }
}
