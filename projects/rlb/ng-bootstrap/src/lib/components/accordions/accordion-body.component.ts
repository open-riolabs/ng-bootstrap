import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class AccordionBodyComponent {
  public parentId = signal<string | undefined>(undefined);
  public itemId = signal<string | undefined>(undefined);
  public expanded = signal(false);
}
