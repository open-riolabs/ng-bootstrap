import { Component, input } from '@angular/core';

@Component({
  selector: 'rlb-button-toolbar',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'btn-toolbar',
    'attr.role': 'toolbar',
  },
  standalone: false
})
export class ButtonToolbarComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal', { alias: 'orientation' });
  size = input<'sm' | 'md' | 'lg'>('md', { alias: 'size' });
}
