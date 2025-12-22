import { Component, Input, booleanAttribute } from '@angular/core';
import { Color, Size } from '../../shared/types';

@Component({
  selector: 'button[rlb-button], a[rlb-button]',
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'mainClass',
    '[attr.disabled]': 'disabled?true:undefined',
  },
  standalone: false
})
export class ButtonComponent {
  @Input({ alias: 'color' }) color?: Color = 'primary';
  @Input({ alias: 'size' }) size?: Size = 'md';
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled?: boolean;
  @Input({ alias: 'outline', transform: booleanAttribute, }) outline?: boolean;
  @Input({ alias: 'isLink', transform: booleanAttribute, }) isLink?: boolean;

  get mainClass() {
    let style = '';
    if (!this.isLink) {
      style = 'btn';
      if (this.color) {
        if (this.outline) {
          style += ` btn-outline-${this.color}`;
        } else {
          style += ` btn-${this.color}`;
        }
      }
      if (this.size !== 'md') {
        style += ` btn-${this.size}`;
      }
    } else {
      style = 'btn btn-link';
      if (this.color) {
        style += ` link-${this.color}`;
      }
    }
    return style;
  }
}
