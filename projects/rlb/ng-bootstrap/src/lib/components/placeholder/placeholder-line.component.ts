import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'rlb-placeholder-line',
	template: ``,
	standalone: false,
})
export class RlbPlaceholderLineComponent {
	@Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
	@Input() color: string = 'secondary';
	@Input() width: string = '100%';
	@Input() height?: string;
	@Input() rounded: boolean = true;
	
	@HostBinding('class') get hostClasses(): string {
		const classes = ['placeholder', `bg-${this.color}`];
		
		if (this.size !== 'md') {
			classes.push(`placeholder-${this.size}`);
		}
		
		if (this.rounded) {
			classes.push('rounded');
		}
		
		return classes.join(' ');
	}
	
	@HostBinding('style.width') get styleWidth() {
		return this.width;
	}
	
	@HostBinding('style.height') get styleHeight() {
		return this.height ?? null;
	}
	
	@HostBinding('style.display') display = 'block';
	@HostBinding('style.margin-bottom') marginBottom = '0.5rem';
}
