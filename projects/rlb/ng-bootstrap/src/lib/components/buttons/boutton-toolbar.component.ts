import { Component, Input } from '@angular/core';

@Component({
  selector: 'rlb-button-toolbar',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'btn-toolbar',
    'attr.role': 'toolbar',
  },
})
export class ButtonToolbarComponent {
  @Input({ alias: 'orientation' }) orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input({ alias: 'size' }) size: 'sm' | 'md' | 'lg' = 'md';
}
