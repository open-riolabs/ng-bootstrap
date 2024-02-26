import {
  Component,
  ContentChildren,
  DoCheck,
  Input,
  QueryList,
  booleanAttribute,
} from '@angular/core';
import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'rlb-list',
  template: `<ng-content select="rlb-list-item, rlb-list-item-image"></ng-content>`,
  host: {
    class: 'list-group',
    '[class.list-group-numbered]': 'numbered',
    '[class.list-group-flush]': 'flush',
    '[class.list-group-horizontal]': 'horizontal',
    '[class.disabled]': 'disabled',
  },
})
export class ListComponent implements DoCheck {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean;
  @Input({ transform: booleanAttribute, alias: 'numbered' }) numbered?: boolean;
  @Input({ transform: booleanAttribute, alias: 'flush' }) flush?: boolean;
  @Input({ transform: booleanAttribute, alias: 'horizontal' }) horizontal?: boolean;

  @ContentChildren(ListItemComponent) children!: QueryList<ListItemComponent>;

  constructor() { }

  ngDoCheck() {
    this.children?.forEach((child) => {
      child.disabled = this.disabled;
    });
  }
}
