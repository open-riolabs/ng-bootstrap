import {
  DoCheck,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';
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
  @Input() title?: string;
  @Input() creationStrategy: 'none' | 'modal' | 'page' = 'none';
  @Input() creationUrl!: any[] | string | null | undefined;
  @Input() items!: any[];
  @Input({ transform: booleanAttribute, alias: 'showPagination' })
  showPagination?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean =
    false;
  @Input({ transform: booleanAttribute, alias: 'showRefresh' })
  showRefresh?: boolean = false;
  @Input() showActions: 'row' | 'head' = 'row';
  @Output() createItem: EventEmitter<void> = new EventEmitter();
  @Output() refreshItem: EventEmitter<void> = new EventEmitter();
  @Output() loadMore: EventEmitter<void> = new EventEmitter();
  @ContentChildren(DataTableRowComponent)
  public rows!: QueryList<DataTableRowComponent>;
  @ContentChildren(DataTableHeaderComponent)
  columns!: QueryList<DataTableHeaderComponent>;
  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef })
  _projectedDisplayColumns!: ViewContainerRef;

  get hasActions() {
    return (
      this.rows?.toArray()?.some((o) => o.hasActions) ||
      this.showActions !== 'row'
    );
  }

  ngDoCheck() {
    for (let i = this._projectedDisplayColumns.length; i > 0; i--) {
      this._projectedDisplayColumns.detach();
    }
    this.columns.forEach((column) => {
      this._projectedDisplayColumns.insert(column._view);
    });
  }

  get cols() {
    return this.columns.length + (this.showActions !== 'row' ? 1 : 0);
  }
}
