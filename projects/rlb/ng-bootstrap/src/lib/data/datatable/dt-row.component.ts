import {
  Component,
  computed,
  contentChildren,
  effect,
  input,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableCellComponent } from './dt-cell.component';

@Component({
  selector: 'rlb-dt-row',
  template: `
    <ng-template #template>
      <tr
        ="cssClass()"
        ="cssStyle()"
        (click)="rowClick.emit($event)"
      >
        <!-- Use programmatic projection for cells! -->
        <ng-container #projectedCells></ng-container>

        @if (hasActions()) {
          <td>
            <ng-container #projectedActions></ng-container>
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

  _projectedActions = viewChild('projectedActions', { read: ViewContainerRef });
  actionsBlock = contentChildren(DataTableActionsComponent);

  // 1. Query the Cell component templates
  _projectedCells = viewChild('projectedCells', { read: ViewContainerRef });
  cells = contentChildren(DataTableCellComponent);

  constructor() {
    effect(() => {
      this._renderActions();
      this._renderCells(); // 2. Add to effect loop
    });
  }

  hasActions = computed(() => {
    return this.actionsBlock().length > 0;
  });

  private _renderActions() {
    const container = this._projectedActions();
    const actions = this.actionsBlock();
    if (container && actions.length > 0) {
      container.clear();
      container.createEmbeddedView(actions[0].template());
    }
  }

  // 3. Render the cells robustly
  private _renderCells() {
    const container = this._projectedCells();
    const cells = this.cells();
    if (container) {
      container.clear();
      cells.forEach(cell => {
        const template = cell.template();
        if (template) {
          container.createEmbeddedView(template);
        }
      });
    }
  }
}
