import { Component, Input, booleanAttribute } from '@angular/core';
import { Color, Size } from '../../shared/types';

@Component({
  selector: 'button[rlb-button], a[rlb-button]',
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'mainClass',
    '[attr.disabled]': "disabled?true:undefined"
  }
})
export class ButtonComponent {
  @Input() color: Color = 'primary';
  @Input() size: Size = 'md';
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'outline' }) outline?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'isLink' }) isLink?: boolean = false;

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
