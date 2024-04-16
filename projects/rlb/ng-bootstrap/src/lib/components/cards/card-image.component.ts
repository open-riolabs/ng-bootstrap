import { Component, Input } from '@angular/core';

@Component({
  selector: 'img[rlb-card-image]',
  template: ``,
  host: {
    '[class.card-img-top]': 'position === "top" && !overlay',
    '[class.card-img-bottom]': 'position === "bottom" && !overlay',
    '[class.card-img]': 'overlay',
  },
})
export class CardImageComponent {
  @Input({ alias: 'position' }) position: 'top' | 'bottom' = 'top';
  overlay?: boolean = false;
}
