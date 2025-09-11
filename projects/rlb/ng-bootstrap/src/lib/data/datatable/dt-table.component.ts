import {
	booleanAttribute,
	Component,
	ContentChildren,
	DoCheck,
	EventEmitter,
	Input,
	numberAttribute,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';

export interface TableDataQuery {
  pagination?: { size: number };
  sorting?: { column: string; direction: string };
  filter?: { [k: string]: number | string | boolean };
}

export interface PaginationEvent {
  page: number;
  size: number;
}

@Component({
    selector: 'rlb-dt-table',
    templateUrl: './dt-table.component.html',
    standalone: false
})
export class DataTableComponent implements OnInit, DoCheck {
  @Input({ alias: 'title' }) title?: string;
  @Input({ alias: 'creation-strategy' }) creationStrategy: 'none' | 'modal' | 'page' = 'none';
  @Input({ alias: 'creation-url' }) creationUrl!: any[] | string | null | undefined;
  @Input({ alias: 'items' }) items!: any[];
  @Input({ alias: 'pagination-mode' }) paginationMode?: 'none' | 'load-more' | 'pages' = 'none';
  @Input({ alias: 'loading', transform: booleanAttribute }) loading?: boolean;
  @Input({ alias: 'show-refresh', transform: booleanAttribute }) showRefresh?: boolean;
  @Input({ alias: 'total-items', transform: numberAttribute }) totalItems?: number;
  @Input({ alias: 'current-page', transform: numberAttribute }) currentPage?: number;
  @Input({ alias: 'page-size', transform: numberAttribute }) pageSize?: number;
  @Input() showActions: 'row' | 'head' = 'row';
  
  // TODO ask we can handle it like this
  @Input() loadMoreLabel: string = 'Load more';

  @Output('create-item') createItem: EventEmitter<void> = new EventEmitter();
  @Output('refresh-item') refreshItem: EventEmitter<void> = new EventEmitter();
  @Output('load-more') loadMore: EventEmitter<void> = new EventEmitter();
  @Output('current-pageChange') currentPageChange: EventEmitter<number> = new EventEmitter();
  @Output('page-sizeChange') pageSizeChange: EventEmitter<number> = new EventEmitter();
  @Output('pagination') pagination: EventEmitter<{ page: number; size: number }> = new EventEmitter();

  @ViewChild('projectedDisplayColumns', { read: ViewContainerRef }) _projectedDisplayColumns!: ViewContainerRef;
  @ContentChildren(DataTableRowComponent) public rows!: QueryList<DataTableRowComponent>;
  @ContentChildren(DataTableHeaderComponent) columns!: QueryList<DataTableHeaderComponent>;

  ngOnInit() {
    this.currentPage = 1;
    this.pageSize = 20;
  }

  get pages() {
    return Math.ceil((this.totalItems || 0) / (this.pageSize || 1));
  }

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

  selectSize() {
    this.currentPageChange.emit(1);
    this.pageSizeChange.emit(parseInt(this.pageSize as any));
    this.pagination.emit({ page: 1, size: this.pageSize ? parseInt(this.pageSize as any) : 20 });
  }


  selectPage(ev: MouseEvent, page: number) {
    ev?.preventDefault();
    ev?.stopPropagation();
		if (page === this.currentPage || this.loading) return;
    this.currentPageChange.emit(page);
    this.pagination.emit({ page, size: this.pageSize ? parseInt(this.pageSize as any) : 20 });
  }

  next(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
		if (this.currentPage === this.pages || this.loading) return;
    this.currentPageChange.emit((this.currentPage || 1) + 1);
		this.pagination.emit({
			page: ((this.currentPage || 1) + 1),
			size: this.pageSize ? parseInt(this.pageSize as any) : 20
		});
  }

  prev(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
		if (this.currentPage === 1 || this.loading) return;
    this.currentPageChange.emit((this.currentPage || 1) - 1);
		this.pagination.emit({
			page: ((this.currentPage || 1) - 1),
			size: this.pageSize ? parseInt(this.pageSize as any) : 20
		});
  }

  onPgWeel(ev: WheelEvent) {
    ev.preventDefault();
    const t = ev.target as HTMLElement;
    const c = t.parentElement?.parentElement
    c?.scrollBy({ left: ev.deltaY < 0 ? -15 : 15 });
  }
}
