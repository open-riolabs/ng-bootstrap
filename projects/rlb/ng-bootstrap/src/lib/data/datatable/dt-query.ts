import { Signal } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  column: string;
  direction: SortDirection;
}

export interface TableFilter {
  [column: string]: number | string | boolean;
}

/**
 * Everything the table knows about what the user is asking to see.
 *
 * The table does not sort or filter anything itself, and cannot: it never holds the rows. Each
 * `rlb-dt-row` is a template projected by the caller, so the order and the membership of the rows
 * are the caller's to decide — exactly as pagination already worked. What the table does is emit
 * this query whenever the user changes page, sorts a column or types in a filter; the caller runs
 * it (against an API, or over its own array) and passes back the rows it produced.
 */
export interface TableDataQuery {
  pagination?: { page?: number; size: number };
  sorting?: TableSort;
  filter?: TableFilter;
}

/**
 * The slice of `rlb-dt-table` that its headers talk to.
 *
 * `rlb-dt-header` is content the caller writes inside `rlb-dt-table`, so it reaches the table
 * through its element injector. It injects this rather than `DataTableComponent` so the two files
 * do not import each other — the import check in this repo rejects cycles, and rightly.
 */
export abstract class DataTableQueryHost {
  abstract readonly sorting: Signal<TableSort | undefined>;
  abstract readonly filter: Signal<TableFilter>;
  /**
   * Whether any column in this table shows a filter box, which makes the header row two lines tall.
   * Columns without one align to the top so every heading still sits on the same line.
   */
  abstract readonly hasFilterRow: Signal<boolean>;
  /** Advance one column through ascending → descending → unsorted. */
  abstract toggleSort(column: string): void;
  /** An empty string clears that column's filter rather than matching on emptiness. */
  abstract setFilter(column: string, value: string): void;
}
