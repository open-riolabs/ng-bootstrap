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
    standalone: false
})
export class ListComponent implements DoCheck {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
  @Input({ alias: 'numbered', transform: booleanAttribute }) numbered?: boolean;
  @Input({ alias: 'flush', transform: booleanAttribute }) flush?: boolean;
  @Input({ alias: 'horizontal', transform: booleanAttribute }) horizontal?: boolean;

  @ContentChildren(ListItemComponent) children!: QueryList<ListItemComponent>;

  constructor() { }

  ngDoCheck() {
    this.children?.forEach((child) => {
      child.disabled = this.disabled;
    });
  }
}
