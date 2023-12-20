import { Component, ContentChild, DoCheck, Input, booleanAttribute } from '@angular/core';
import { AccordionHeaderComponent } from './accordion-header.component';
import { AccordionBodyComponent } from './accordion-body.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'div[rlb-accordion-item]',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'accordion-item'
  },
})
export class AccordionItemComponent implements DoCheck {
  public parentId!: string
  public alwaysOpen?: boolean = false
  @Input() public name?: string
  @Input({ transform: booleanAttribute, alias: 'expanded' }) expanded: boolean = false

  @ContentChild(AccordionHeaderComponent) public header!: AccordionHeaderComponent
  @ContentChild(AccordionBodyComponent) public body!: AccordionBodyComponent

  constructor(private idService: UniqueIdService) { }

  ngDoCheck(): void {
    if (this.parentId) {
      if (!this.name) {
        this.name = `${this.parentId}-item${this.idService.id}`;
      }

      if (this.header) {
        this.header.parentId = this.parentId
        this.header.itemId = this.name
        this.header.expanded = this.expanded
      }

      if (this.body) {
        this.body.parentId = this.parentId
        this.body.itemId = this.name
        this.body.expanded = this.expanded
      }
    }
  }
}
