import { Component, Input } from '@angular/core';

@Component({
	selector: 'rlb-placeholder',
	template: `
		<div [ngClass]="containerClass">
			<ng-content/>
		</div>`,
	standalone: false
})
export class RlbPlaceholderComponent {
	@Input() animation: 'glow' | 'wave' | 'none' = 'none';
	
	get containerClass(): string | string[] {
		if (this.animation === 'none') return [];
		return `placeholder-${this.animation}`;
	}
}
