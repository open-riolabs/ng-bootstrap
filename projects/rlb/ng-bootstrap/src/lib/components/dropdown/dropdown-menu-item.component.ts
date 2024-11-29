import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
    selector: 'li[rlb-dropdown-item]',
    template: ` <a
      *ngIf="!header && !divider"
      class="dropdown-item"
      href="#"
      [class.active]="active"
      [class.disabled]="disabled"
      [attr.aria-current]="active"
      [attr.aria-disabled]="disabled"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>
    <h6 *ngIf="header" class="dropdown-header">
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </h6>
    <hr *ngIf="divider" class="dropdown-divider" />
    <ng-template #content><ng-content /></ng-template>`,
    standalone: false
})
export class DropdownMenuItemComponent {
  @Input({ alias: 'active', transform: booleanAttribute }) active?: boolean;
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
  @Input({ alias: 'header', transform: booleanAttribute }) header?: boolean;
  @Input({ alias: 'divider', transform: booleanAttribute }) divider?: boolean;
}
