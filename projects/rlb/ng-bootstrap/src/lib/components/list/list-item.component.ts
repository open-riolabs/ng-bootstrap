import {
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-list-item',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'list-group-item',
    '[class.disabled]': 'disabled',
    '[class.list-group-item-action]': 'action',
    '[class.active]': 'active',
    '[attr.aria-current]': 'active',
  },
})
export class ListItemComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active?: boolean;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean;
  @Input({ transform: booleanAttribute, alias: 'action' }) action?: boolean;

  constructor() { }
}
