import {
  booleanAttribute,
  Component,
  input,
} from '@angular/core';

@Component({
  selector: 'rlb-list',
  template: `<ng-content select="rlb-list-item, rlb-list-item-image"></ng-content>`,
  host: {
    class: 'list-group',
    '[class.list-group-numbered]': 'numbered()',
    '[class.list-group-flush]': 'flush()',
    '[class.list-group-horizontal]': 'horizontal()',
    '[class.disabled]': 'disabled()',
  },
  standalone: false
})
export class ListComponent {
  disabled = input(false, { transform: booleanAttribute });
  numbered = input(false, { transform: booleanAttribute });
  flush = input(false, { transform: booleanAttribute });
  horizontal = input(false, { transform: booleanAttribute });
}
