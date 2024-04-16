import { Component, Input } from '@angular/core';

@Component({
  selector: 'rlb-input-group',
  host: {
    class: 'input-group has-validation',
    '[class.input-group-sm]': 'size === "small"',
    '[class.input-group-lg]': 'size === "large"',
  },
  template: `<ng-content></ng-content>`,
})
export class InputGroupComponent {
  @Input({ alias: 'size' }) size: 'small' | 'large' | undefined = undefined;
}

@Component({
  selector: 'rlb-input-text-group',
  host: { class: 'input-group-text' },
  template: `<ng-content></ng-content>`,
})
export class InputTextGroupComponent { }
