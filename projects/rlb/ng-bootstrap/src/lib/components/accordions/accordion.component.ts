import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  DoCheck,
  booleanAttribute,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'rlb-accordion',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'accordion',
    '[class.accordion-flush]': 'flush',
    '[id]': 'id',
  },
})
export class AccordionComponent implements DoCheck {
  @Input({ transform: booleanAttribute, alias: 'flush' }) flush?: boolean =
    false;
  @Input({ transform: booleanAttribute, alias: 'always-open' })
  alwaysOpen?: boolean = false;
  @Input() id!: string;
  @ContentChildren(AccordionItemComponent)
  public items!: QueryList<AccordionItemComponent>;
  constructor(private idService: UniqueIdService) {}

  ngDoCheck(): void {
    if (!this.id) {
      this.id = `accordion${this.idService.id}`;
    }

    if (this.items) {
      this.items.forEach((item) => {
        item.parentId = this.id;
        item.alwaysOpen = this.alwaysOpen;
      });
    }
  }
}
