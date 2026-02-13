import {
  booleanAttribute,
  Component,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { Color, TextAlignment } from '../../shared/types';
import { CardBodyComponent } from './card-body.component';
import { CardImageComponent } from './card-image.component';

@Component({
  selector: 'rlb-card',
  template: `
    <ng-content
      select="rlb-card-header,[rlb-card-image]:not([position='bottom'])"
    />
    <ng-content select="rlb-card-body, ul[rlb-list]" />
    <ng-content select="rlb-card-footer,[rlb-card-image][position='bottom']" />
  `,
  host: {
    class: 'card',
    '[class.text-center]': 'align() === "center"',
    '[class.text-end]': 'align() === "right"',
    '[class.text-bg-primary]': 'background() === "primary"',
    '[class.text-bg-secondary]': 'background() === "secondary"',
    '[class.text-bg-success]': 'background() === "success"',
    '[class.text-bg-danger]': 'background() === "danger"',
    '[class.text-bg-warning]': 'background() === "warning"',
    '[class.text-bg-info]': 'background() === "info"',
    '[class.text-bg-light]': 'background() === "light"',
    '[class.text-bg-dark]': 'background() === "dark"',
    '[class.border-primary]': 'border() === "primary"',
    '[class.border-secondary]': 'border() === "secondary"',
    '[class.border-success]': 'border() === "success"',
    '[class.border-danger]': 'border() === "danger"',
    '[class.border-warning]': 'border() === "warning"',
    '[class.border-info]': 'border() === "info"',
    '[class.border-light]': 'border() === "light"',
    '[class.border-dark]': 'border() === "dark"',
  },
  standalone: false
})
export class CardComponent {
  align = input<TextAlignment | undefined>('left', { alias: 'align' });
  overlay = input(false, { alias: 'overlay', transform: booleanAttribute });
  background = input<Color | undefined>(undefined, { alias: 'background' });
  border = input<Color | undefined>(undefined, { alias: 'border' });

  body = contentChild(CardBodyComponent);
  image = contentChild(CardImageComponent);

  constructor() {
    effect(() => {
      const isOverlay = this.overlay() ?? false;
      const body = this.body();
      if (body) {
        body.overlay.set(isOverlay);
      }
      const image = this.image();
      if (image) {
        image.overlay.set(isOverlay);
      }
    });
  }
}
