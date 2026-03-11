import { Component, signal } from '@angular/core';

@Component({
  selector: 'rlb-accordion-header',
  template: `
    <button class="accordion-button" rlb-button toggle="collapse" [toggle-target]="itemId() || ''" [collapsed]="!expanded()">
      <ng-content></ng-content>
    </button>`,
  host: { class: 'accordion-header' },
  standalone: false
})
export class AccordionHeaderComponent {
  public parentId = signal<string | undefined>(undefined);
  public itemId = signal<string | undefined>(undefined);
  public expanded = signal(false);
}
