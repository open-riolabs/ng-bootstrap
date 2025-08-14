import { Directive } from '@angular/core';


@Directive({
	selector: '[rlb-offcanvas-title]',
	standalone: true,
	host: {
		class: 'offcanvas-title'
	}
})
export class RlbOffcanvasTitleDirective {}