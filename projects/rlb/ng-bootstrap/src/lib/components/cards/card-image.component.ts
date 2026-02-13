import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'img[rlb-card-image]',
  template: ``,
  host: {
    '[class.card-img-top]': 'position() === "top" && !overlay()',
    '[class.card-img-bottom]': 'position() === "bottom" && !overlay()',
    '[class.card-img]': 'overlay()',
  },
  standalone: false
})
export class CardImageComponent {
  position = input<'top' | 'bottom'>('top', { alias: 'position' });
  overlay = signal(false);
}
