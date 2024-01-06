import {
  Component,
  ContentChildren,
  QueryList,
  DoCheck,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';

@Component({
  selector: 'tr[rlb-dt-row]',
  template: ` <ng-content select="td[rlb-dt-cell]" />
    <td rlb-dt-cell *ngIf="hasActions">
      <ng-container #projectedActions></ng-container>
    </td>`,
})
export class DataTableRowComponent implements DoCheck {
  @ViewChild('projectedActions', { read: ViewContainerRef })
  _projectedActions!: ViewContainerRef;
  @ContentChildren(DataTableActionsComponent)
  public actionsBlock!: QueryList<DataTableActionsComponent>;

  public get hasActions() {
    return !!this.actionsBlock && !!this.actionsBlock.first;
  }

  ngDoCheck() {
    if (this.hasActions) {
      for (let i = this._projectedActions.length; i > 0; i--) {
        this._projectedActions.detach();
      }
      this._projectedActions.insert(this.actionsBlock.first._view);
    }
  }
}
