import { Component } from '@angular/core';

@Component({
  selector: 'div[rlb-accordion-body]',
  template: ` <div class="accordion-body">
    <ng-content></ng-content>
  </div>`,
  host: {
    class: 'accordion-collapse collapse',
    '[class.show]': 'expanded',
    '[data-bs-parent]': 'parentId',
    '[id]': 'itemId',
    '[attr.data-bs-parent]': "'#'+parentId",
  },
})
export class AccordionBodyComponent {
  public parentId!: string;
  public itemId!: string;
  public expanded: boolean = false;
}
