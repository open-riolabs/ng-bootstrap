import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';

/**
 * What to offer once rows are selected.
 *
 * Projected into `rlb-dt-table` and shown in place of the toolbar while the selection is not
 * empty — the two never compete for the same strip, because «delete the 3 selected rows» and
 * «create a new one» are not choices a user makes at the same moment.
 */
@Component({
  selector: 'rlb-dt-bulk-actions',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableBulkActionsComponent {
  template = viewChild.required<TemplateRef<any>>('template');
}
