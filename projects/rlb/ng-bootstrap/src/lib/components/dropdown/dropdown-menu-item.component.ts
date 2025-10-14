import { booleanAttribute, Component, Input } from '@angular/core';

@Component({
    selector: 'li[rlb-dropdown-item]',
	template: `
		<span
			*ngIf="!link && !divider && !header"
			class="dropdown-item "
			role="button"
			[class.active]="active"
			[class.disabled]="disabled"
			[class.text-wrap]="textWrap"
			[class.text-break]="textWrap"
			[attr.aria-current]="active"
			[attr.aria-disabled]="disabled"
		>
				<ng-container *ngTemplateOutlet="content"></ng-container>
			</span>
		<a
			*ngIf="link"
			class="dropdown-item "
			[routerLink]="link"
      [class.active]="active"
      [class.disabled]="disabled"
			[class.text-wrap]="textWrap"
			[class.text-break]="textWrap"
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
	@Input({ alias: 'link' }) link?: string = '';
	@Input({ alias: 'text-wrap', transform: booleanAttribute }) textWrap?: boolean;
}
