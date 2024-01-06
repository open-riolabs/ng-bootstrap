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
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
