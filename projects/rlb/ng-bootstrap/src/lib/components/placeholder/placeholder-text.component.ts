import { Component, Input } from '@angular/core';

@Component({
	selector: 'rlb-placeholder-text',
	standalone: false,
	template: `
    <rlb-placeholder [animation]="animation">
      @for (w of computedWidths; track w) {
        <rlb-placeholder-line
          [size]="size"
          [color]="color"
          [width]="w"
          [rounded]="rounded"
          [height]="height"
        ></rlb-placeholder-line>
      }
    </rlb-placeholder>
    `,
})
export class RlbPlaceholderTextComponent {
	@Input() lines: number = 1;
	@Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
	@Input() color: string = 'secondary';
	@Input() animation: 'glow' | 'wave' | 'none' = 'none';
	@Input() width: string | string[] = '100%';
	@Input() height?: string;
	@Input() rounded: boolean = true;
	
	get computedWidths(): string[] {
		if (Array.isArray(this.width)) {
			return Array.from({ length: this.lines }).map((_, i) => this.width[i] ?? '100%');
		}
		return Array.from({ length: this.lines }).map(() => this.width as string);
	}
}
