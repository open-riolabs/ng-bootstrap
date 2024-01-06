import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'h2[rlb-accordion-header]',
  template: ` <button
    class="accordion-button"
    rlb-button
    toggle="collapse"
    [toggle-target]="itemId"
    [collapsed]="!expanded"
  >
    <ng-content></ng-content>
  </button>`,
  host: { class: 'accordion-header' },
})
export class AccordionHeaderComponent {
  public parentId!: string;
  public itemId!: string;
  public expanded: boolean = false;
}
