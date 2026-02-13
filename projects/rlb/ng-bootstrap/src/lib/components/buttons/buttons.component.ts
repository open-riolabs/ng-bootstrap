import {
  booleanAttribute,
  Component,
  input,
} from '@angular/core';
import { Color, Size } from '../../shared/types';

@Component({
  selector: 'button[rlb-button], a[rlb-button]',
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'mainClass()',
    '[attr.disabled]': 'disabled() ? true : undefined',
  },
  standalone: false
})
export class ButtonComponent {
  color = input<Color | undefined>('primary');
  size = input<Size | undefined>('md');
  disabled = input(false, { transform: booleanAttribute });
  outline = input(false, { transform: booleanAttribute });
  isLink = input(false, { transform: booleanAttribute });

  mainClass() {
    let style = '';
    const isLink = this.isLink();
    const color = this.color();
    const outline = this.outline();
    const size = this.size();

    if (!isLink) {
      style = 'btn';
      if (color) {
        if (outline) {
          style += ` btn-outline-${color}`;
        } else {
          style += ` btn-${color}`;
        }
      }
      if (size !== 'md') {
        style += ` btn-${size}`;
      }
    } else {
      style = 'btn btn-link';
      if (color) {
        style += ` link-${color}`;
      }
    }
    return style;
  }
}
