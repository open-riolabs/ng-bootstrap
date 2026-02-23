import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'rlb-placeholder-text',
	standalone: false,
	template: `
    <rlb-placeholder [animation]="animation()">
      @for (w of computedWidths(); track w) {
        <rlb-placeholder-line
          [size]="size()"
          [color]="color()"
          [width]="w"
          [rounded]="rounded()"
          [height]="height()"
        ></rlb-placeholder-line>
      }
    </rlb-placeholder>
    `,
})
export class RlbPlaceholderTextComponent {
	lines = input(1);
	size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
	color = input('secondary');
	animation = input<'glow' | 'wave' | 'none'>('none');
	width = input<string | string[]>('100%');
	height = input<string | undefined>(undefined);
	rounded = input(true);

	computedWidths = computed(() => {
		const lines = this.lines();
		const width = this.width();
		if (Array.isArray(width)) {
			return Array.from({ length: lines }).map((_, i) => width[i] ?? '100%');
		}
		return Array.from({ length: lines }).map(() => width as string);
	});
}
