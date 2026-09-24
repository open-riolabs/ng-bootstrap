import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableCellComponent } from './dt-cell.component';
import { DataTableHost } from './dt-host';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'rlb-dt-row',
    template: `
    <ng-template #template>
      <tr
        [class]="cssClass()"
        [style]="cssStyle()"
        (click)="rowClick.emit($event)"
      >
        @if (selectable()) {
          <!-- The click is stopped here: ticking a row is not clicking it. -->
          <td
            data-export="skip"
            class="align-middle"
            style="width: 1%"
            (click)="$event.stopPropagation()"
          >
            @if (selectable() && hasKey()) {
              <input
                type="checkbox"
                class="form-check-input m-0"
                [checked]="selected()"
                [attr.aria-label]="selectLabel()"
                (change)="onSelect($event)"
              />
            }
          </td>
        }

        <!-- Cells are matched to columns by position, so a hidden column hides the nth cell. -->
        @for (cell of cells(); track $index) {
          @if (visibleAt($index)) {
            <ng-container *ngTemplateOutlet="cell.template()"></ng-container>
          }
        }

        @if (hasActions()) {
          <td data-export="skip">
            <!-- Loop and render actions natively -->
            @for (actionBlock of actionsBlock(); track $index) {
              <ng-container *ngTemplateOutlet="actionBlock.template()"></ng-container>
            }
          </td>
        }
      </tr>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class DataTableRowComponent {
  private host = inject(DataTableHost, { optional: true });
  private defaults = inject(RLB_DEFAULTS).table;

  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });
  rowClick = output<MouseEvent>({ alias: 'row-click' });

  /**
   * What this row *is*, for selection: an id, or the object itself. Whatever comes out of
   * `[(selection)]` on the table is exactly what was put in here.
   *
   * A selectable table whose rows say nothing renders the column but no tick box — the table has
   * no way to name a row it was never told the name of, and silently selecting the wrong thing
   * would be worse.
   */
  rowKey = input<unknown>(undefined, { alias: 'row-key' });

  /** Accessible name for this row's tick box. */
  selectRowLabel = input<string | undefined>(undefined);

  template = viewChild.required<TemplateRef<any>>('template');

  actionsBlock = contentChildren(DataTableActionsComponent);
  cells = contentChildren(DataTableCellComponent);

  hasActions = computed(() => this.actionsBlock().length > 0);

  protected selectable = computed(() => this.host?.selectable() ?? false);
  protected hasKey = computed(() => this.rowKey() !== undefined);
  protected selected = computed(() => this.host?.isRowSelected(this.rowKey()) ?? false);
  protected selectLabel = computed(() => this.selectRowLabel() ?? this.defaults.selectRowLabel);

  protected visibleAt(index: number): boolean {
    return this.host?.isColumnVisibleAt(index) ?? true;
  }

  protected onSelect(event: Event) {
    this.host?.setRowSelected(this.rowKey(), (event.target as HTMLInputElement).checked);
  }
}
