import { Component, Input, booleanAttribute } from "@angular/core";

@Component({
  selector: 'li[rlb-dropdown-item]',
  template: `
    <a *ngIf="!header && !divider" class="dropdown-item" href="#" 
      [class.active]="active" 
      [class.disabled]="disabled" 
      [attr.aria-current]="active"
      [attr.aria-disabled]="disabled">
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>
    <h6 *ngIf="header" class="dropdown-header">
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </h6>
    <hr *ngIf="divider" class="dropdown-divider">
    <ng-template #content><ng-content /></ng-template>`
})
export class DropdownMenuItemComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'header' }) header?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'divider' }) divider?: boolean = false;
}