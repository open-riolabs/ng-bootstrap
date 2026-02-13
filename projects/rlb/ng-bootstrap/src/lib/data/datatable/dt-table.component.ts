import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';

export interface TableDataQuery {
  pagination?: { size: number; };
  sorting?: { column: string; direction: string; };
  filter?: { [k: string]: number | string | boolean; };
}

export interface PaginationEvent {
  page: number;
  size: number;
}

@Component({
  selector: 'rlb-dt-table',
  templateUrl: './dt-table.component.html',
  standalone: false,
})
export class DataTableComponent
  implements OnInit, AfterViewInit, OnDestroy {
  title = input<string | undefined>(undefined);
  creationStrategy = input<'none' | 'modal' | 'page'>('none', { alias: 'creation-strategy' });
  creationUrl = input<any[] | string | null | undefined>(undefined, { alias: 'creation-url' });
  items = input<any[]>([]);
  paginationMode = input<'none' | 'load-more' | 'pages'>('none', { alias: 'pagination-mode' });
  loading = input(false, { transform: booleanAttribute });
  tableHover = input(false, { alias: 'table-hover', transform: booleanAttribute });
  tableStriped = input(true, { alias: 'table-striped', transform: booleanAttribute });
  tableStripedColumns = input(false, { alias: 'table-striped-columns', transform: booleanAttribute });
  tableBordered = input(false, { alias: 'table-bordered', transform: booleanAttribute });
  tableBorderless = input(false, { alias: 'table-borderless', transform: booleanAttribute });
  tableSmall = input(false, { alias: 'table-small', transform: booleanAttribute });
  showRefresh = input(false, { alias: 'show-refresh', transform: booleanAttribute });
  totalItems = input(undefined, { alias: 'total-items', transform: numberAttribute });
  currentPage = input(undefined, { alias: 'current-page', transform: numberAttribute });
  pageSize = input(undefined, { alias: 'page-size', transform: numberAttribute });
  showActions = input<'row' | 'head'>('row');
  loadMoreLabel = input('Load more');

  createItem = output<void>({ alias: 'create-item' });
  refreshItem = output<void>({ alias: 'refresh-item' });
  loadMore = output<void>({ alias: 'load-more' });
  currentPageChange = output<number>({ alias: 'current-pageChange' });
  pageSizeChange = output<number>({ alias: 'page-sizeChange' });
  pagination = output<{
    page: number;
    size: number;
  }>({ alias: 'pagination' });

  _projectedDisplayColumns = viewChild.required<ViewContainerRef>('projectedDisplayColumns');
  rows = contentChildren(DataTableRowComponent);
  columns = contentChildren(DataTableHeaderComponent);

  readonly MAX_VISIBLE_PAGES = 7;

  constructor() {
    effect(() => {
      this._renderHeaders();
    });
  }

  ngOnInit() {
    // defaults handled by input initial values or logic
  }

  pages = computed(() => Math.ceil((this.totalItems() || 0) / (this.pageSize() || 1)));

  hasActions = computed(() =>
    this.rows().some((o) => o.hasActions) ||
    this.showActions() !== 'row'
  );

  visiblePages = computed(() => {
    const total = this.pages();
    const current = this.currentPage() || 1;
    const pages: (number | string)[] = [];

    if (total <= this.MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }

    return pages;
  });

  ngAfterViewInit() {
    this._renderHeaders();
  }

  ngOnDestroy() {
    // Effect cleanup
  }

  private _renderHeaders() {
    const projectedColumns = this._projectedDisplayColumns();
    if (projectedColumns) {
      for (let i = projectedColumns.length; i > 0; i--) {
        projectedColumns.detach();
      }
      this.columns().forEach((column) => {
        projectedColumns.insert(column._view);
      });
    }
  }

  cols = computed(() => this.columns().length + (this.hasActions() ? 1 : 0));

  getTableClasses(): string[] {
    const classes = ['table'];

    if (this.tableStriped()) {
      classes.push('table-striped');
    }

    if (this.tableStripedColumns()) {
      classes.push('table-striped-columns');
    }

    if (this.tableHover()) {
      classes.push('table-hover');
    }

    if (this.tableBordered()) {
      classes.push('table-bordered');
    }

    if (this.tableBorderless()) {
      classes.push('table-borderless');
    }

    if (this.tableSmall()) {
      classes.push('table-small');
    }

    return classes;
  }

  onPageSizeChange(newSize: number) {
    this.currentPageChange.emit(1);
    this.pageSizeChange.emit(newSize);
    this.pagination.emit({
      page: 1,
      size: newSize,
    });
  }

  selectPage(ev: MouseEvent, page: number | string) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (typeof page !== 'number' || page === this.currentPage() || this.loading())
      return;
    this.currentPageChange.emit(page);
    this.pagination.emit({
      page,
      size: this.pageSize() ? parseInt(this.pageSize() as any) : 20,
    });
  }

  next(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (this.currentPage() === this.pages() || this.loading()) return;
    this.currentPageChange.emit((this.currentPage() || 1) + 1);
    this.pagination.emit({
      page: (this.currentPage() || 1) + 1,
      size: this.pageSize() ? parseInt(this.pageSize() as any) : 20,
    });
  }

  prev(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (this.currentPage() === 1 || this.loading()) return;
    this.currentPageChange.emit((this.currentPage() || 1) - 1);
    this.pagination.emit({
      page: (this.currentPage() || 1) - 1,
      size: this.pageSize() ? parseInt(this.pageSize() as any) : 20,
    });
  }
}
