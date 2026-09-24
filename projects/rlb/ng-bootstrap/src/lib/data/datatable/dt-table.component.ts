import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  numberAttribute,
  OnDestroy,
  OnInit,
  output,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, Subject, timer } from 'rxjs';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';
import { DataTableNoItemsComponent } from './dt-noitems.component';
import { DataTableLoadingComponent } from './dt-loading.component';
import { DataTableQueryHost, TableDataQuery, TableFilter, TableSort } from './dt-query';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SelectComponent } from '../../forms/inputs/select.component';
import { FormsModule } from '@angular/forms';
import { OptionComponent } from '../../forms/inputs/options.component';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RLB_ICONS } from '../../shared/icons';

export interface PaginationEvent {
  page: number;
  size: number;
}

@Component({
  selector: 'rlb-dt-table',
  templateUrl: './dt-table.component.html',
  host: {
    // This automatically adds the 'dt-card-style' class to the <rlb-dt-table>
    // element in the DOM if cardStyle() is true.
    '[class.dt-card-style]': 'cardStyle()',
  },
  providers: [
    { provide: DataTableQueryHost, useExisting: forwardRef(() => DataTableComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgClass, SelectComponent, FormsModule, OptionComponent],
})
export class DataTableComponent implements OnInit, OnDestroy, DataTableQueryHost {
  protected icons = inject(RLB_ICONS);
  private defaults = inject(RLB_DEFAULTS).table;

  title = input<string | undefined>(undefined);
  creationStrategy = input<'none' | 'modal' | 'page'>('none', { alias: 'creation-strategy' });
  creationUrl = input<any[] | string | null | undefined>(undefined, { alias: 'creation-url' });
  items = input<any[]>([]);
  paginationMode = input<'none' | 'load-more' | 'pages'>('none', { alias: 'pagination-mode' });
  loading = input(false, { transform: booleanAttribute });
  tableHover = input(false, { alias: 'table-hover', transform: booleanAttribute });
  tableStriped = input(false, { alias: 'table-striped', transform: booleanAttribute });
  tableStripedColumns = input(false, {
    alias: 'table-striped-columns',
    transform: booleanAttribute,
  });
  tableBordered = input(false, { alias: 'table-bordered', transform: booleanAttribute });
  tableBorderless = input(false, { alias: 'table-borderless', transform: booleanAttribute });
  tableSmall = input(false, { alias: 'table-small', transform: booleanAttribute });
  showRefresh = input(false, { alias: 'show-refresh', transform: booleanAttribute });
  totalItems = input(undefined, { alias: 'total-items', transform: numberAttribute });
  currentPage = input(undefined, { alias: 'current-page', transform: numberAttribute });
  pageSize = input(undefined, { alias: 'page-size', transform: numberAttribute });
  showActions = input<'row' | 'head'>('row');
  loadMoreLabel = input<string | undefined>(undefined);
  /**
   * The header over the column of row actions.
   *
   * It was the literal word `Actions` in the template, which put an English heading on every table
   * of every console built on this library, in whatever language the rest of the page was speaking.
   * The default is kept English so nothing changes for a caller that says nothing; a caller that
   * translates now can.
   */
  actionsLabel = input<string | undefined>(undefined);
  /**
   * What the two icon-only buttons in the header are called.
   *
   * Both were an `<i>` and nothing else, so a screen reader announced «button» twice and left the
   * user to guess which was which. English defaults, as above.
   */
  refreshLabel = input<string | undefined>(undefined);
  createLabel = input<string | undefined>(undefined);

  /** The choices in the page-size menu. */
  pageSizes = input<number[] | undefined>(undefined, { alias: 'page-sizes' });

  // What the template actually prints: this element's word, else the application's, else English.
  protected actionsText = computed(() => this.actionsLabel() ?? this.defaults.actionsLabel);
  protected loadMoreText = computed(() => this.loadMoreLabel() ?? this.defaults.loadMoreLabel);
  protected refreshText = computed(() => this.refreshLabel() ?? this.defaults.refreshLabel);
  protected createText = computed(() => this.createLabel() ?? this.defaults.createLabel);
  protected pageSizeChoices = computed(() => this.pageSizes() ?? this.defaults.pageSizes);
  cardStyle = input(true, { alias: 'card-style', transform: booleanAttribute });

  /**
   * Which column is sorting, and in which direction. Two-way: bind `[(sorting)]` to drive it from
   * the URL or restore it from storage, or read it from `(data-query)` and ignore it here.
   */
  sorting = model<TableSort | undefined>(undefined);
  /** The value typed into each filterable column, keyed by that column's `field`. */
  filter = model<TableFilter>({});
  /** How long to wait after the last keystroke before emitting a filter query. */
  filterDebounce = input(300, { alias: 'filter-debounce', transform: numberAttribute });

  createItem = output<void>({ alias: 'create-item' });
  refreshItem = output<void>({ alias: 'refresh-item' });
  loadMore = output<void>({ alias: 'load-more' });
  currentPageChange = output<number>({ alias: 'current-pageChange' });
  pageSizeChange = output<number>({ alias: 'page-sizeChange' });
  pagination = output<{
    page: number;
    size: number;
  }>({ alias: 'pagination' });

  /**
   * Page, sorting and filters together, every time any of them changes.
   *
   * `(pagination)` still fires exactly as before for callers that only page; this is the one to
   * listen to once a column can sort or filter, because those three have to travel together — a
   * sort applied to page 4 of the old order is meaningless.
   */
  dataQuery = output<TableDataQuery>({ alias: 'data-query' });

  _projectedDisplayColumns = viewChild('projectedDisplayColumns', {
    read: ViewContainerRef,
  });

  rows = contentChildren(DataTableRowComponent);
  columns = contentChildren(DataTableHeaderComponent);

  _projectedNoItems = viewChild('projectedNoItems', { read: ViewContainerRef });
  _projectedLoading = viewChild('projectedLoading', { read: ViewContainerRef });
  _projectedRows = viewChild('projectedRows', { read: ViewContainerRef });

  noItemsBlock = contentChildren(DataTableNoItemsComponent);
  loadingBlock = contentChildren(DataTableLoadingComponent);

  readonly MAX_VISIBLE_PAGES = 7;

  private filterTyped$ = new Subject<{ column: string; value: string }>();

  constructor() {
    // One effect per projected block, deliberately.
    //
    // These four used to share a single effect, so a change to any one of them tore down and
    // rebuilt all four. That was merely wasteful until a header gained a filter box: rows change
    // in answer to what the user types, the headers were rebuilt along with them, and the input
    // the user was typing into was replaced mid-word — losing focus after the first keystroke.
    // Split, each block re-renders only when its own content children change.
    effect(() => this._renderHeaders());
    effect(() => this._renderNoItems());
    effect(() => this._renderLoading());
    effect(() => this._renderRows());

    // Typing in a filter box must not put one request per keystroke on the wire.
    this.filterTyped$
      .pipe(
        debounce(() => timer(this.filterDebounce())),
        takeUntilDestroyed(),
      )
      .subscribe(({ column, value }) => this.applyFilter(column, value));
  }

  ngOnInit() {
    // defaults handled by input initial values or logic
  }

  pages = computed(() => Math.ceil((this.totalItems() || 0) / (this.pageSize() || 1)));

  hasActions = computed(
    () => this.rows().some(o => o.hasActions()) || this.showActions() !== 'row',
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

  ngOnDestroy() {
    // Effect cleanup
  }

  private _renderRows() {
    const container = this._projectedRows();
    const rows = this.rows();
    if (container) {
      container.clear();
      rows.forEach(row => {
        const template = row.template();
        if (template) {
          container.createEmbeddedView(template);
        }
      });
    }
  }

  private _renderNoItems() {
    const container = this._projectedNoItems();
    const block = this.noItemsBlock()[0];
    if (container && block) {
      container.clear();
      container.createEmbeddedView(block.template());
    }
  }

  private _renderLoading() {
    const container = this._projectedLoading();
    const block = this.loadingBlock()[0];
    if (container && block) {
      container.clear();
      container.createEmbeddedView(block.template());
    }
  }

  private _renderHeaders() {
    const container = this._projectedDisplayColumns();
    if (container) {
      container.clear();
      this.columns().forEach(column => {
        // Use the template to create a new view
        container.createEmbeddedView(column.template());
      });
    }
  }

  cols = computed(() => this.columns().length + (this.hasActions() ? 1 : 0));

  hasFilterRow = computed(() => this.columns().some(column => column.canFilter()));

  getTableClasses(): string[] {
    const classes = ['table'];

    if (this.tableStriped()) {
      classes.push('table-striped');
    }

    if (this.tableStripedColumns()) {
      classes.push('table-striped-columns');
    }

    if (this.tableHover() && this.items().length > 0) {
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

  // ---------------------------------------------------------------------------------------------
  // Sorting and filtering — DataTableQueryHost, called by the headers through the element injector.
  // ---------------------------------------------------------------------------------------------

  /**
   * Ascending → descending → unsorted, which is the third state most tables forget to offer and
   * the only way back to whatever order the data arrived in.
   */
  toggleSort(column: string) {
    const current = this.sorting();
    let next: TableSort | undefined;
    if (!current || current.column !== column) {
      next = { column, direction: 'asc' };
    } else if (current.direction === 'asc') {
      next = { column, direction: 'desc' };
    } else {
      next = undefined;
    }
    this.sorting.set(next);
    this.goToFirstPageAndEmit();
  }

  setFilter(column: string, value: string) {
    this.filterTyped$.next({ column, value });
  }

  private applyFilter(column: string, value: string) {
    const next: TableFilter = { ...this.filter() };
    if (value === '') {
      delete next[column];
    } else {
      next[column] = value;
    }
    this.filter.set(next);
    this.goToFirstPageAndEmit();
  }

  /**
   * A new sort or filter invalidates the page the user is on — page 4 of the old ordering is not
   * page 4 of the new one — so both send the caller back to the first page.
   */
  private goToFirstPageAndEmit() {
    if (this.paginationMode() === 'pages' && (this.currentPage() || 1) !== 1) {
      this.currentPageChange.emit(1);
      this.pagination.emit({ page: 1, size: this.resolvedPageSize() });
    }
    this.emitDataQuery(1);
  }

  private resolvedPageSize(): number {
    const size = this.pageSize();
    return size ? Number(size) : this.defaults.pageSize;
  }

  private emitDataQuery(page: number) {
    this.dataQuery.emit({
      pagination: { page, size: this.resolvedPageSize() },
      sorting: this.sorting(),
      filter: this.filter(),
    });
  }

  onPageSizeChange(newSize: number) {
    this.currentPageChange.emit(1);
    this.pageSizeChange.emit(newSize);
    this.pagination.emit({
      page: 1,
      size: newSize,
    });
    this.dataQuery.emit({
      pagination: { page: 1, size: newSize },
      sorting: this.sorting(),
      filter: this.filter(),
    });
  }

  selectPage(ev: MouseEvent, page: number | string) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (typeof page !== 'number' || page === this.currentPage() || this.loading()) return;
    this.currentPageChange.emit(page);
    this.pagination.emit({
      page,
      size: this.resolvedPageSize(),
    });
    this.emitDataQuery(page);
  }

  next(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (this.currentPage() === this.pages() || this.loading()) return;
    const page = (this.currentPage() || 1) + 1;
    this.currentPageChange.emit(page);
    this.pagination.emit({
      page,
      size: this.resolvedPageSize(),
    });
    this.emitDataQuery(page);
  }

  prev(ev: MouseEvent) {
    ev?.preventDefault();
    ev?.stopPropagation();
    if (this.currentPage() === 1 || this.loading()) return;
    const page = (this.currentPage() || 1) - 1;
    this.currentPageChange.emit(page);
    this.pagination.emit({
      page,
      size: this.resolvedPageSize(),
    });
    this.emitDataQuery(page);
  }
}
