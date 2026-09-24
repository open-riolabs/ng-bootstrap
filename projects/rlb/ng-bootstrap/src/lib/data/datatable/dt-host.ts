import { Signal } from '@angular/core';
import { TableFilter, TableSort } from './dt-query';

/**
 * The slice of `rlb-dt-table` that its headers and rows talk to.
 *
 * Both are content the caller writes *inside* `rlb-dt-table`, so they reach the table through
 * their element injector. They inject this rather than `DataTableComponent` so the files do not
 * import each other — the import check in this repo rejects cycles, and rightly.
 *
 * Columns are addressed two ways on purpose. A header knows its own `field`, so it asks by name;
 * a cell has no field of its own and is matched to its column by position, which is how this table
 * has always paired `rlb-dt-header` with `rlb-dt-cell`.
 */
export abstract class DataTableHost {
  // ---- what the user is asking to see -----------------------------------------------------
  abstract readonly sorting: Signal<TableSort | undefined>;
  abstract readonly filter: Signal<TableFilter>;
  /**
   * Whether any column shows a filter box, which makes the header row two lines tall. Columns
   * without one align to the top so every heading still sits on the same line.
   */
  abstract readonly hasFilterRow: Signal<boolean>;
  /** Advance one column through ascending → descending → unsorted. */
  abstract toggleSort(column: string): void;
  /** An empty string clears that column's filter rather than matching on emptiness. */
  abstract setFilter(column: string, value: string): void;

  // ---- columns ----------------------------------------------------------------------------
  abstract readonly stickyHeader: Signal<boolean>;
  /** Asked by a header, which knows its own `field`. */
  abstract isColumnHidden(field: string | undefined): boolean;
  /** Asked by a row for each of its cells, which are matched to columns by position. */
  abstract isColumnVisibleAt(index: number): boolean;

  // ---- selection --------------------------------------------------------------------------
  abstract readonly selectable: Signal<boolean>;
  abstract isRowSelected(key: unknown): boolean;
  abstract setRowSelected(key: unknown, selected: boolean): void;
}
