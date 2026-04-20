import { Directive } from '@angular/core';


@Directive({
	selector: '[rlb-offcanvas-title]',

	host: {
		class: 'offcanvas-title'
	}
})
export class RlbOffcanvasTitleDirective {}