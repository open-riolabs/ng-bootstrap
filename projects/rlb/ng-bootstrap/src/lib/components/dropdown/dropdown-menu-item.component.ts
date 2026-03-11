import { booleanAttribute, Component, input } from '@angular/core';

@Component({
	selector: 'li[rlb-dropdown-item]',
	template: `
		@if (!link() && !divider() && !header()) {
		  <span
		    class="dropdown-item "
		    role="button"
		    [class.active]="active()"
		    [class.disabled]="disabled()"
		    [class.text-wrap]="textWrap()"
		    [class.text-break]="textWrap()"
		    [attr.aria-current]="active()"
		    [attr.aria-disabled]="disabled()"
		    >
		    <ng-container *ngTemplateOutlet="content"></ng-container>
		  </span>
		}
		@if (link()) {
		  <a
		    class="dropdown-item "
		    [routerLink]="link()"
		    [class.active]="active()"
		    [class.disabled]="disabled()"
		    [class.text-wrap]="textWrap()"
		    [class.text-break]="textWrap()"
		    [attr.aria-current]="active()"
		    [attr.aria-disabled]="disabled()"
		    >
		    <ng-container *ngTemplateOutlet="content"></ng-container>
		  </a>
		}
		@if (header()) {
		  <h6 class="dropdown-header">
		    <ng-container *ngTemplateOutlet="content"></ng-container>
		  </h6>
		}
		@if (divider()) {
		  <hr class="dropdown-divider" />
		}
		<ng-template #content><ng-content /></ng-template>`,
	standalone: false
})
export class DropdownMenuItemComponent {
	active = input(false, { alias: 'active', transform: booleanAttribute });
	disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
	header = input(false, { alias: 'header', transform: booleanAttribute });
	divider = input(false, { alias: 'divider', transform: booleanAttribute });
	link = input<string | undefined>(undefined, { alias: 'link' });
	textWrap = input(false, { alias: 'text-wrap', transform: booleanAttribute });
}
