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
  @Input({ alias: 'active', transform: booleanAttribute }) active?: boolean;
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
  @Input({ alias: 'action', transform: booleanAttribute }) action?: boolean;

  constructor() { }
}
