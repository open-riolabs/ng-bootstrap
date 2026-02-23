import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'rlb-placeholder-line',
	template: ``,
	host: {
		'[class]': 'hostClasses()',
		'[style.width]': 'width()',
		'[style.height]': 'height() ?? null',
		'[style.display]': '"block"',
		'[style.margin-bottom]': '"0.5rem"',
	},
	standalone: false,
})
export class RlbPlaceholderLineComponent {
	size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
	color = input('secondary');
	width = input('100%');
	height = input<string | undefined>(undefined);
	rounded = input(true);

	hostClasses = computed(() => {
		const classes = ['placeholder', `bg-${this.color()}`];

		if (this.size() !== 'md') {
			classes.push(`placeholder-${this.size()}`);
		}

		if (this.rounded()) {
			classes.push('rounded');
		}

		return classes.join(' ');
	});
}
