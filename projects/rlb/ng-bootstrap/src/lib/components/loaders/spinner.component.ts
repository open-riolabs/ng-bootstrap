import { Component, input } from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-spinner',
  template: `<span class="visually-hidden">Loading...</span>`,
  host: {
    '[class.spinner-border]': 'style() === "border"',
    '[class.spinner-grow]': 'style() === "grow"',
    '[class.spinner-border-sm]': 'size() === "sm" && style() === "border"',
    '[class.spinner-grow-sm]': 'size() === "sm" && style() === "grow"',
    '[class.spinner-border-lg]': 'size() === "lg" && style() === "border"',
    '[class.spinner-grow-lg]': 'size() === "lg" && style() === "grow"',
    role: 'status',
    '[class]': "'text-'+color()",
  },
  standalone: false
})
export class SpinnerComponent {
  style = input<'grow' | 'border'>('border', { alias: 'style' });
  color = input<Color>('primary', { alias: 'color' });
  size = input<'sm' | 'md' | 'lg'>('md', { alias: 'size' });
}
