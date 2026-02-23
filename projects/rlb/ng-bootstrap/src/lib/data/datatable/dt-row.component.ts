import {
  Component,
  computed,
  contentChildren,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableCellComponent } from './dt-cell.component';

@Component({
  selector: 'rlb-dt-row',
  template: `
    <ng-template #template>
      <tr
        [class]="cssClass()"
        [style]="cssStyle()"
        (click)="rowClick.emit($event)"
      >
        <!-- Loop and render cells natively -->
        @for (cell of cells(); track $index) {
          <ng-container *ngTemplateOutlet="cell.template()"></ng-container>
        }

        @if (hasActions()) {
          <td>
            <!-- Loop and render actions natively -->
            @for (actionBlock of actionsBlock(); track $index) {
              <ng-container *ngTemplateOutlet="actionBlock.template()"></ng-container>
            }
          </td>
        }
      </tr>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableRowComponent {
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });
  rowClick = output<MouseEvent>();

  template = viewChild.required<TemplateRef<any>>('template');

  actionsBlock = contentChildren(DataTableActionsComponent);
  cells = contentChildren(DataTableCellComponent);

  hasActions = computed(() => this.actionsBlock().length > 0);
}
