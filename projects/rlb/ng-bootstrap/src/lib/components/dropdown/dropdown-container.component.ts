import { Component, ElementRef, Input } from '@angular/core';

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
      '[style.border]': 'isList ? null : "none"',
      '[style.padding]': 'isList ? null : "0px"',
    },
    standalone: false
})
export class DropdownContainerComponent {
  isList: boolean = false;
  
  @Input({ alias: 'placement' }) public placement!: 'left' | 'right';
  @Input({ alias: 'placement-sm' }) public placementSm!: 'left' | 'right'
  @Input({ alias: 'placement-md' }) public placementMd!: 'left' | 'right'
  @Input({ alias: 'placement-lg' }) public placementLg!: 'left' | 'right'
  @Input({ alias: 'placement-xl' }) public placementXl!: 'left' | 'right'
  @Input({ alias: 'placement-xxl' }) public placementXxl!: 'left' | 'right'

  constructor(
    private elementRef: ElementRef,
  ) {
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'ul') {
      this.isList = true;
    }
  }
}
