import { Component, signal } from '@angular/core';

@Component({
  selector: 'div[rlb-accordion-body]',
  template: ` <div class="accordion-body">
    <ng-content></ng-content>
  </div>`,
  host: {
    class: 'accordion-collapse collapse',
    '[class.show]': 'expanded()',
    '[id]': 'itemId()',
  },
  standalone: false
})
export class AccordionBodyComponent {
  public parentId = signal<string | undefined>(undefined);
  public itemId = signal<string | undefined>(undefined);
  public expanded = signal(false);
}
