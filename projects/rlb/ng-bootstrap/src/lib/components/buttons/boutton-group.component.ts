import { Component, input } from '@angular/core';

@Component({
  selector: 'rlb-button-group',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.btn-group]': 'orientation() !== "vertical"',
    '[class.btn-group-vertical]': 'orientation() === "vertical"',
    '[class.btn-group-sm]': 'size() === "sm"',
    '[class.btn-group-lg]': 'size() === "lg"',
    'attr.role': 'group',
  },
  standalone: false
})
export class ButtonGroupComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal', { alias: 'orientation' });
  size = input<'sm' | 'md' | 'lg'>('md', { alias: 'size' });
}
