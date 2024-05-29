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
  template: `<ng-content select="[rlb-accordion-item]"></ng-content>`,
  host: {
    class: 'accordion',
    '[class.accordion-flush]': 'flush',
    '[id]': 'id',
  },
})
export class AccordionComponent implements DoCheck {
  @Input({ alias: 'flush', transform: booleanAttribute }) flush?: boolean = false;
  @Input({ alias: 'always-open', transform: booleanAttribute }) alwaysOpen?: boolean = false;
  @Input({ alias: 'id' }) id!: string;

  @ContentChildren(AccordionItemComponent) public items!: QueryList<AccordionItemComponent>;
  constructor(private idService: UniqueIdService) { }

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
