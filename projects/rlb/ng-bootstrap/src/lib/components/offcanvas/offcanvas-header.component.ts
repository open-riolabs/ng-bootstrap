import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'rlb-offcanvas-header',
	template: `
		<ng-content select="[rlb-offcanvas-title]"></ng-content>
		<button
			type="button"
			class="btn-close"
			data-bs-dismiss="offcanvas"
			[attr.data-bs-target]="_offcanvasId()"
			aria-label="Close"
		></button>
	`,
	host: {
		class: 'offcanvas-header d-flex justify-content-between align-items-center'
	},
	standalone: false
})
export class OffcanvasHeaderComponent {
	offcanvasId = input<string>('');

	_offcanvasId = computed(() => `#${this.offcanvasId()}`);
}
