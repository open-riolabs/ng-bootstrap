import { DoCheck, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef, booleanAttribute } from '@angular/core';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';

export interface TableDataQuery {
  pagination?: { size: number };
  sorting?: { column: string; direction: string };
  filter?: { [k: string]: number | string | boolean };
}

@Component({
  selector: 'rlb-dt-table',
  templateUrl: './dt-table.component.html',
})
export class DataTableComponent implements DoCheck {
  @Input({ alias: 'title' }) title?: string;
  @Input({ alias: 'creation-strategy' }) creationStrategy: 'none' | 'modal' | 'page' = 'none';
  @Input({ alias: 'creation-url' }) creationUrl!: any[] | string | null | undefined;
  @Input({ alias: 'items' }) items!: any[];
  @Input({ alias: 'show-pagination', transform: booleanAttribute }) showPagination?: boolean;
  @Input({ alias: 'loading', transform: booleanAttribute }) loading?: boolean;
  @Input({ alias: 'show-refresh', transform: booleanAttribute }) showRefresh?: boolean;
  @Input() showActions: 'row' | 'head' = 'row';

  @Output('create-item') createItem: EventEmitter<void> = new EventEmitter();
  @Output('refresh-item') refreshItem: EventEmitter<void> = new EventEmitter();
  @Output('load-more') loadMore: EventEmitter<void> = new EventEmitter();

  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef }) _projectedDisplayColumns!: ViewContainerRef;
  @ContentChildren(DataTableRowComponent) public rows!: QueryList<DataTableRowComponent>;
  @ContentChildren(DataTableHeaderComponent) columns!: QueryList<DataTableHeaderComponent>;

  get hasActions() {
    return (
      this.rows?.toArray()?.some((o) => o.hasActions) ||
      this.showActions !== 'row'
    );
  }

  ngDoCheck() {
    if (this._projectedDisplayColumns) {
      for (let i = this._projectedDisplayColumns.length; i > 0; i--) {
        this._projectedDisplayColumns.detach();
      }
      this.columns.forEach((column) => {
        this._projectedDisplayColumns.insert(column._view);
      });
    }
  }

  get cols() {
    return this.columns.length + (this.showActions !== 'row' ? 1 : 0);
  }
}
