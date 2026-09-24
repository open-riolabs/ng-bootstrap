import { InjectionToken, Provider } from '@angular/core';

export interface RlbTableDefaults {
  /** Rows per page when a table does not say. */
  pageSize: number;
  /** The choices offered in the page-size menu. */
  pageSizes: number[];
  /** The heading over the column of row actions. */
  actionsLabel: string;
  /** The button that appends the next batch in `load-more` mode. */
  loadMoreLabel: string;
  /** The icon-only button that reloads the current data. */
  refreshLabel: string;
  /** The icon-only button that starts a new item. */
  createLabel: string;
  /** The control that sorts a column. */
  sortLabel: string;
  /** The box that filters a column. */
  filterLabel: string;
  /** The tick box on a single row. */
  selectRowLabel: string;
  /** The tick box in the header that takes every row on the page. */
  selectAllLabel: string;
  /** The menu that shows and hides columns. */
  columnsLabel: string;
  /** The button that downloads the table as CSV. */
  exportLabel: string;
  /** The button that unticks everything. */
  clearSelectionLabel: string;
  /**
   * How many rows are selected, as a sentence.
   *
   * A function rather than a word, because «3 selected» does not survive translation as a number
   * glued to a noun: languages disagree about order, and about which plural a 3 takes.
   */
  selectedCountLabel: (count: number) => string;
}

export interface RlbDateDefaults {
  /** The zone dates are read and written in when a control does not say. */
  timezone: string;
}

export interface RlbDefaults {
  table: RlbTableDefaults;
  date: RlbDateDefaults;
}

/**
 * What the library does when a caller says nothing — the same English words and the same numbers
 * that used to be written into each component.
 */
export const RLB_BUILT_IN_DEFAULTS: RlbDefaults = {
  table: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    actionsLabel: 'Actions',
    loadMoreLabel: 'Load more',
    refreshLabel: 'Refresh',
    createLabel: 'Create',
    sortLabel: 'Sort',
    filterLabel: 'Filter',
    selectRowLabel: 'Select row',
    selectAllLabel: 'Select all rows',
    columnsLabel: 'Columns',
    exportLabel: 'Export CSV',
    clearSelectionLabel: 'Clear',
    selectedCountLabel: (count: number) => `${count} selected`,
  },
  date: {
    timezone: 'UTC',
  },
};

export const RLB_DEFAULTS = new InjectionToken<RlbDefaults>('RLB_DEFAULTS', {
  providedIn: 'root',
  factory: () => RLB_BUILT_IN_DEFAULTS,
});

export interface RlbDefaultsOverride {
  table?: Partial<RlbTableDefaults>;
  date?: Partial<RlbDateDefaults>;
}

/**
 * Set once what every table and date control would otherwise be told one at a time.
 *
 * Each of these was a literal inside a component: the word `Actions` over every actions column, a
 * page size of 20, the list `10, 20, 50, 100`, the zone `UTC`. A caller could override them, but
 * only per element — which in a console with forty tables means saying the same thing forty times,
 * and forgetting it on the forty-first.
 *
 * ```ts
 * provideRlbDefaults({
 *   table: { pageSize: 25, actionsLabel: 'Azioni', sortLabel: 'Ordina' },
 *   date: { timezone: 'Europe/Rome' },
 * })
 * ```
 *
 * An element that says something still wins; anything left out keeps the value above.
 */
export function provideRlbDefaults(defaults: RlbDefaultsOverride): Provider {
  return {
    provide: RLB_DEFAULTS,
    useValue: {
      table: { ...RLB_BUILT_IN_DEFAULTS.table, ...defaults.table },
      date: { ...RLB_BUILT_IN_DEFAULTS.date, ...defaults.date },
    } satisfies RlbDefaults,
  };
}
