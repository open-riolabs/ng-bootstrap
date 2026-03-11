import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { ListComponent } from './list.component';

@Component({
  selector: 'rlb-list-item',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'list-group-item',
    '[class.disabled]': 'disabled()',
    '[class.list-group-item-action]': 'action()',
    '[class.active]': 'active()',
    '[attr.aria-current]': 'active()',
  },
  standalone: false
})
export class ListItemComponent {
  private parent = inject(ListComponent, { optional: true });

  active = input(false, { transform: booleanAttribute });
  disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  action = input(false, { transform: booleanAttribute });

  disabled = computed(() => this.disabledInput() || this.parent?.disabled() || false);
}
