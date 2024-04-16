import { Component, Input } from '@angular/core';

@Component({
  selector: 'rlb-button-group',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.btn-group]': 'orientation !== "vertical"',
    '[class.btn-group-vertical]': 'orientation === "vertical"',
    '[class.btn-group-sm]': 'size === "sm"',
    '[class.btn-group-lg]': 'size === "lg"',
    'attr.role': 'group',
  },
})
export class ButtonGroupComponent {
  @Input({ alias: 'orientation' }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input({ alias: 'size' }) size: 'sm' | 'md' | 'lg' = 'md';
}
