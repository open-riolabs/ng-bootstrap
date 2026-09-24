import { InjectionToken, Provider } from '@angular/core';

/**
 * The icons this library draws, named by what they mean rather than by which glyph they are.
 *
 * Every value is whatever your icon font wants on an `<i>`: a class string for an icon font, which
 * is what the default set below uses. Components never write a glyph name of their own, so an
 * application that ships a different icon set — or none — overrides the names it cares about once
 * and the whole library follows.
 *
 * This exists because the datatable used to draw `fa-solid fa-arrows-rotate` while `ng add`
 * installs `bootstrap-icons` and nothing else: three buttons rendered as empty boxes in every
 * project created from the schematic, and no supported way to point them anywhere else.
 */
export interface RlbIconSet {
  /** Reload the current data. */
  refresh: string;
  /** Create a new item. */
  add: string;
  /** Dismiss or remove. */
  close: string;
  /** Search. */
  search: string;
  /** Opens a menu of further actions. */
  more: string;
  /** Edit an item. */
  edit: string;
  /** Delete an item. */
  delete: string;
  /** Step back — previous page, previous month. */
  chevronLeft: string;
  /** Step forward — next page, next month. */
  chevronRight: string;
  /** Opens something that drops below it — a tree branch, a select. */
  chevronDown: string;
  /** Upload, or a drop target waiting for a file. */
  upload: string;
  /** A file that has been attached. */
  file: string;
  /** Reply to a message. */
  reply: string;
  /** A message that has been read. */
  read: string;
  /** A column sorted smallest-first. */
  sortAscending: string;
  /** A column sorted largest-first. */
  sortDescending: string;
  /** A sortable column that is not currently sorting. */
  sortNone: string;
  /** Download what is on screen. */
  download: string;
  /** The menu that shows and hides columns. */
  columns: string;
  /** Something went wrong, or a step is in error. */
  warning: string;
  /** There is nothing here yet. */
  empty: string;
  /** Done. */
  check: string;
  /** Opens a calendar. */
  calendar: string;
  /** A measure that went up. */
  trendUp: string;
  /** A measure that went down. */
  trendDown: string;
  /** A measure that did neither. */
  trendFlat: string;
  /** Opens a clock. */
  clock: string;
  /** A rating point not given. */
  star: string;
  /** A rating point given. */
  starFilled: string;
  /** The light theme. */
  themeLight: string;
  /** The dark theme. */
  themeDark: string;
  /** The theme that follows the operating system. */
  themeAuto: string;
}

/**
 * The bootstrap-icons set, which is what `ng add @open-rlb/ng-bootstrap` installs.
 */
export const RLB_DEFAULT_ICONS: RlbIconSet = {
  refresh: 'bi bi-arrow-clockwise',
  add: 'bi bi-plus-lg',
  close: 'bi bi-x-lg',
  search: 'bi bi-search',
  more: 'bi bi-three-dots',
  edit: 'bi bi-pencil',
  delete: 'bi bi-trash',
  chevronLeft: 'bi bi-chevron-left',
  chevronRight: 'bi bi-chevron-right',
  chevronDown: 'bi bi-chevron-down',
  upload: 'bi bi-cloud-arrow-up',
  file: 'bi bi-file-earmark-text',
  reply: 'bi bi-reply-fill',
  read: 'bi bi-check-all',
  sortAscending: 'bi bi-sort-up',
  sortDescending: 'bi bi-sort-down',
  sortNone: 'bi bi-arrow-down-up',
  download: 'bi bi-download',
  columns: 'bi bi-layout-three-columns',
  warning: 'bi bi-exclamation-triangle',
  empty: 'bi bi-inbox',
  check: 'bi bi-check-lg',
  calendar: 'bi bi-calendar3',
  trendUp: 'bi bi-arrow-up-right',
  trendDown: 'bi bi-arrow-down-right',
  trendFlat: 'bi bi-dash',
  clock: 'bi bi-clock',
  star: 'bi bi-star',
  starFilled: 'bi bi-star-fill',
  themeLight: 'bi bi-sun',
  themeDark: 'bi bi-moon-stars',
  themeAuto: 'bi bi-circle-half',
};

export const RLB_ICONS = new InjectionToken<RlbIconSet>('RLB_ICONS', {
  providedIn: 'root',
  factory: () => RLB_DEFAULT_ICONS,
});

/**
 * Point some or all of the library's icons at a different set.
 *
 * Names left out keep their bootstrap-icons default, so an application that only swaps its
 * delete icon says only that:
 *
 * ```ts
 * provideRlbIcons({ delete: 'fa-solid fa-trash' })
 * ```
 */
export function provideRlbIcons(icons: Partial<RlbIconSet>): Provider {
  return {
    provide: RLB_ICONS,
    useValue: { ...RLB_DEFAULT_ICONS, ...icons } satisfies RlbIconSet,
  };
}
