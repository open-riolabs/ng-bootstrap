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
