import { Component, signal } from '@angular/core';
import { TableDataQuery } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TablesComponent {
  // ── Basic static table ────────────────────────────────────────────────────
  basicExample = `<rlb-dt-table>
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-row>
    <rlb-dt-cell>1</rlb-dt-cell>
    <rlb-dt-cell>George</rlb-dt-cell>
    <rlb-dt-cell>george&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
    <rlb-dt-cell>2</rlb-dt-cell>
    <rlb-dt-cell>Paul</rlb-dt-cell>
    <rlb-dt-cell>paul&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
    <rlb-dt-cell>3</rlb-dt-cell>
    <rlb-dt-cell>Alex</rlb-dt-cell>
    <rlb-dt-cell>alex&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
</rlb-dt-table>`;

  // ── Table style modifiers ─────────────────────────────────────────────────
  stylesExample = `<rlb-dt-table table-hover table-striped table-small>
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-row>
    <rlb-dt-cell>1</rlb-dt-cell>
    <rlb-dt-cell>George</rlb-dt-cell>
    <rlb-dt-cell>george&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
    <rlb-dt-cell>2</rlb-dt-cell>
    <rlb-dt-cell>Paul</rlb-dt-cell>
    <rlb-dt-cell>paul&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
  <rlb-dt-row>
    <rlb-dt-cell>3</rlb-dt-cell>
    <rlb-dt-cell>Alex</rlb-dt-cell>
    <rlb-dt-cell>alex&#64;gmail.com</rlb-dt-cell>
  </rlb-dt-row>
</rlb-dt-table>`;

  // ── Sorting and filtering ─────────────────────────────────────
  sortingExample = `<rlb-dt-table [items]="rows()" (data-query)="onDataQuery($event)">
  <rlb-dt-header field="id" sortable>ID</rlb-dt-header>
  <rlb-dt-header field="name" sortable filtrable>Name</rlb-dt-header>
  <rlb-dt-header field="email" filtrable>Email</rlb-dt-header>
  &#64;for (user of rows(); track user.id) {
    <rlb-dt-row>
      <rlb-dt-cell>{{ user.id }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.name }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.email }}</rlb-dt-cell>
    </rlb-dt-row>
  }
</rlb-dt-table>`;

  private readonly allSortableUsers = [
    { id: 1, name: 'George', email: 'george@gmail.com' },
    { id: 2, name: 'Paul', email: 'paul@gmail.com' },
    { id: 3, name: 'Alex', email: 'alex@gmail.com' },
    { id: 4, name: 'Bianca', email: 'bianca@gmail.com' },
  ];

  readonly sortableUsers = signal(this.allSortableUsers);

  /**
   * The table emits the query; answering it is the caller's job. Here that means sorting and
   * filtering a local array, but the same handler would forward the query to an API unchanged.
   */
  onDataQuery(query: TableDataQuery) {
    const filter = query.filter ?? {};
    let rows = this.allSortableUsers.filter(user =>
      Object.entries(filter).every(([field, value]) =>
        String((user as Record<string, unknown>)[field] ?? '')
          .toLowerCase()
          .includes(String(value).toLowerCase()),
      ),
    );

    const sorting = query.sorting;
    if (sorting) {
      rows = [...rows].sort((a, b) => {
        const left = (a as Record<string, unknown>)[sorting.column] as string | number;
        const right = (b as Record<string, unknown>)[sorting.column] as string | number;
        const comparison = left > right ? 1 : left < right ? -1 : 0;
        return sorting.direction === 'asc' ? comparison : -comparison;
      });
    }

    this.sortableUsers.set(rows);
  }

  // ── Selection, columns, sticky header and export ───────────────────
  advancedExample = `<rlb-dt-table
  selectable
  show-columns
  show-export
  sticky-header
  max-height="18rem"
  [(selection)]="selected"
  [(hiddenColumns)]="hiddenColumns">

  <rlb-dt-header field="id" hideable label="ID">ID</rlb-dt-header>
  <rlb-dt-header field="name" hideable label="Name" sortable>Name</rlb-dt-header>
  <rlb-dt-header field="email" hideable label="Email">Email</rlb-dt-header>

  <rlb-dt-bulk-actions>
    <button rlb-button color="danger" size="sm" (click)="deleteSelected()">Delete</button>
  </rlb-dt-bulk-actions>

  &#64;for (user of users; track user.id) {
    <rlb-dt-row [row-key]="user.id">
      <rlb-dt-cell>{{ user.id }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.name }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.email }}</rlb-dt-cell>
    </rlb-dt-row>
  }
</rlb-dt-table>`;

  readonly manyUsers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: ['George', 'Paul', 'Alex', 'Bianca'][i % 4] + ' ' + (i + 1),
    email: 'user' + (i + 1) + '@gmail.com',
  }));

  readonly selected = signal<unknown[]>([]);
  readonly hiddenColumns = signal<string[]>([]);

  deleteSelected() {
    const ids = this.selected();
    this.removed.set(ids.length);
    this.selected.set([]);
  }

  readonly removed = signal(0);

  // ── Pagination (pages mode) ───────────────────────────────────────────────
  paginationExample = `<rlb-dt-table
  [items]="users"
  [pagination-mode]="'pages'"
  [total-items]="users.length"
  [(current-page)]="page"
  [page-size]="3">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  @for (user of users; track user) {
    <rlb-dt-row>
      <rlb-dt-cell>{{ user.id }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.name }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.email }}</rlb-dt-cell>
      <rlb-dt-actions>
        <rlb-dt-action (click)="onEdit(user)">Edit</rlb-dt-action>
        <rlb-dt-action (click)="onDelete(user)">Delete</rlb-dt-action>
      </rlb-dt-actions>
    </rlb-dt-row>
  }
</rlb-dt-table>`;

  // ── Load-more ─────────────────────────────────────────────────────────────
  loadMoreExample = `<rlb-dt-table
  [items]="usersLoadMore"
  [pagination-mode]="'load-more'"
  [loadMoreLabel]="'Load more users'"
  (load-more)="onLoadMore()">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  @for (user of usersLoadMore; track user) {
    <rlb-dt-row>
      <rlb-dt-cell>{{ user.id }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.name }}</rlb-dt-cell>
      <rlb-dt-cell>{{ user.email }}</rlb-dt-cell>
    </rlb-dt-row>
  }
</rlb-dt-table>`;

  // ── No items ──────────────────────────────────────────────────────────────
  noItemsExample = `<rlb-dt-table [items]="[]">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-noitems>
    <rlb-alert>No users available.</rlb-alert>
  </rlb-dt-noitems>
</rlb-dt-table>`;

  // ── Loading state ─────────────────────────────────────────────────────────
  loadingExample = `<rlb-dt-table [items]="users" [loading]="true">
  <rlb-dt-header>ID</rlb-dt-header>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-header>Email</rlb-dt-header>
  <rlb-dt-loading>
    <rlb-spinner [color]="'primary'"></rlb-spinner>
  </rlb-dt-loading>
</rlb-dt-table>`;

  // ── Component state ───────────────────────────────────────────────────────
  users = [
    { id: 1, name: 'Pippo', email: 'pippo@gmail.com' },
    { id: 2, name: 'Pluto', email: 'pluto@gmail.com' },
    { id: 3, name: 'Paul', email: 'paul@gmail.com' },
  ];

  page: number = 1;

  onEdit(user: any) {
    console.log('Edit user', user);
  }

  onDelete(user: any) {
    console.log('Delete user', user);
  }

  usersLoadMore = [
    { id: 1, name: 'Pippo', email: 'pippo@gmail.com' },
    { id: 2, name: 'Pluto', email: 'pluto@gmail.com' },
    { id: 3, name: 'Paul', email: 'paul@gmail.com' },
  ];

  onLoadMore() {
    this.usersLoadMore = [
      ...this.usersLoadMore,
      { id: 4, name: 'Mario', email: 'mario@gmail.com' },
      { id: 5, name: 'Luigi', email: 'luigi@gmail.com' },
    ];
  }

  // ── API rows — rlb-dt-table ───────────────────────────────────────────────
  tableApi: DocApiRow[] = [
    { name: 'title', type: 'string | undefined', default: 'undefined', description: 'Optional heading displayed at the top of the table card.', kind: 'Input' },
    { name: 'items', type: 'any[]', default: '[]', description: 'Data items rendered as rows. Required when using data-driven mode.', kind: 'Input' },
    { name: 'pagination-mode', type: "'none' | 'load-more' | 'pages'", default: "'none'", description: 'Pagination strategy: none (static), load-more button, or numbered pages.', kind: 'Input' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'When true the loading slot is shown instead of rows.', kind: 'Input' },
    { name: 'total-items', type: 'number | undefined', default: 'undefined', description: 'Total item count used to compute the page count.', kind: 'Input' },
    { name: 'current-page', type: 'number | undefined', default: 'undefined', description: 'Active page index (1-based). Supports two-way binding via [(current-page)].', kind: 'Two-way' },
    { name: 'page-size', type: 'number | undefined', default: 'undefined', description: 'Number of rows per page. Supports two-way binding via [(page-size)].', kind: 'Two-way' },
    { name: 'creation-strategy', type: "'none' | 'modal' | 'page'", default: "'none'", description: 'Controls how new items are created: none disables the button, modal opens a dialog, page navigates to creation-url.', kind: 'Input' },
    { name: 'creation-url', type: 'string | any[] | null | undefined', default: 'undefined', description: 'Router link or URL string used when creation-strategy is page.', kind: 'Input' },
    { name: 'show-refresh', type: 'boolean', default: 'false', description: 'Shows a refresh icon button in the table header toolbar.', kind: 'Input' },
    { name: 'showActions', type: "'row' | 'head'", default: "'row'", description: "Position of the actions column: 'row' places a dropdown per row, 'head' places actions in the header.", kind: 'Input' },
    { name: 'loadMoreLabel', type: 'string', default: "'Load more'", description: "Label for the load-more button shown when pagination-mode is 'load-more'.", kind: 'Input' },
    { name: 'table-hover', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-hover class for a highlight on row mouse-over.', kind: 'Input' },
    { name: 'table-striped', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-striped class for alternating row backgrounds.', kind: 'Input' },
    { name: 'table-striped-columns', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-striped-columns class for alternating column backgrounds.', kind: 'Input' },
    { name: 'table-bordered', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-bordered class.', kind: 'Input' },
    { name: 'table-borderless', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-borderless class.', kind: 'Input' },
    { name: 'table-small', type: 'boolean', default: 'false', description: 'Adds Bootstrap table-small class for compact row padding.', kind: 'Input' },
    { name: 'card-style', type: 'boolean', default: 'true', description: 'Wraps the table in a card-style container by adding the dt-card-style host class.', kind: 'Input' },
    { name: 'create-item', type: 'void', description: 'Emitted when the user clicks the create button (creation-strategy is modal).', kind: 'Output' },
    { name: 'refresh-item', type: 'void', description: 'Emitted when the user clicks the refresh button.', kind: 'Output' },
    { name: 'load-more', type: 'void', description: "Emitted when the user clicks the load-more button (pagination-mode is 'load-more').", kind: 'Output' },
    { name: 'pagination', type: '{ page: number; size: number }', description: 'Emitted on every page or page-size change with the new page index and size.', kind: 'Output' },
    { name: 'selectable', type: 'boolean', default: 'false', description: 'Adds a tick-box column. Each rlb-dt-row must say what it is through row-key; a row that says nothing gets the column but no tick box.', kind: 'Input' },
    { name: 'selection', type: 'unknown[]', default: '[]', description: 'The ticked rows, as whatever each row-key was. Two-way.', kind: 'Two-way' },
    { name: 'hiddenColumns', type: 'string[]', default: '[]', description: 'Columns currently hidden, by field. Two-way, so it can be kept in the URL.', kind: 'Two-way' },
    { name: 'show-columns', type: 'boolean', default: 'false', description: 'Shows the menu that hides and shows the columns marked hideable.', kind: 'Input' },
    { name: 'sticky-header', type: 'boolean', default: 'false', description: 'Keeps the header in place while the body scrolls. Needs max-height to scroll within.', kind: 'Input' },
    { name: 'max-height', type: 'string | undefined', default: 'undefined', description: 'A CSS length. Sets the height the table body scrolls inside, e.g. 60vh.', kind: 'Input' },
    { name: 'show-export', type: 'boolean', default: 'false', description: 'Shows the button that downloads the table as CSV.', kind: 'Input' },
    { name: 'export-mode', type: "'client' | 'emit'", default: "'client'", description: 'client builds the file in the browser and downloads it; emit only fires (export-csv), for a caller that would rather ask its server for the whole set.', kind: 'Input' },
    { name: 'export-filename', type: 'string', default: "'export.csv'", description: 'Name of the downloaded file.', kind: 'Input' },
    { name: 'export-csv', type: 'string[][]', description: 'The table as rows of text, exactly as it is on screen. Fired whether or not the browser also downloads it.', kind: 'Output' },
    { name: 'data-query', type: 'TableDataQuery', description: 'Emitted whenever the page, the sorting or a column filter changes, carrying all three together. Listen to this one as soon as a column can sort or filter.', kind: 'Output' },
    { name: 'sorting', type: 'TableSort | undefined', default: 'undefined', description: 'Which column is sorting and in which direction. Two-way: bind [(sorting)] to drive it from the URL or restore it.', kind: 'Input' },
    { name: 'filter', type: 'TableFilter', default: '{}', description: 'Value of each column filter, keyed by the header field. Two-way.', kind: 'Input' },
    { name: 'filter-debounce', type: 'number', default: '300', description: 'Milliseconds to wait after the last keystroke before emitting a filter query.', kind: 'Input' },
    { name: 'refreshLabel', type: 'string', default: "'Refresh'", description: 'Accessible name for the icon-only refresh button.', kind: 'Input' },
    { name: 'createLabel', type: 'string', default: "'Create'", description: 'Accessible name for the icon-only create button.', kind: 'Input' },
  ];

  // ── API rows — rlb-dt-header ──────────────────────────────────────────────
  headerApi: DocApiRow[] = [
    { name: 'field', type: 'string | undefined', default: 'undefined', description: 'Data field name this column maps to (used for sorting).', kind: 'Input' },
    { name: 'type', type: "'number' | 'string' | undefined", default: 'undefined', description: 'Data type of the column, used when sorting.', kind: 'Input' },
    { name: 'sortable', type: 'boolean', default: 'false', description: 'Shows a sort control that cycles ascending, descending and unsorted. Requires field, and emits (data-query) on the table.', kind: 'Input' },
    { name: 'hideable', type: 'boolean', default: 'false', description: 'Lets the user hide this column from the table column menu. Needs field and label.', kind: 'Input' },
    { name: 'label', type: 'string | undefined', default: 'undefined', description: 'Name for this column in the column menu. The heading itself is projected content the table cannot read. Falls back to field.', kind: 'Input' },
    { name: 'filtrable', type: 'boolean', default: 'false', description: 'Shows a filter box under the column heading. Requires field. Emits (data-query) once typing stops.', kind: 'Input' },
    { name: 'sortLabel', type: 'string', default: "'Sort'", description: 'Accessible name for the sort control, which is otherwise only an arrow.', kind: 'Input' },
    { name: 'filterLabel', type: 'string', default: "'Filter'", description: 'Accessible name for the filter box.', kind: 'Input' },
    { name: 'filterPlaceholder', type: 'string | undefined', default: 'undefined', description: 'Placeholder shown inside the filter box.', kind: 'Input' },
    { name: 'class', type: 'string | undefined', default: 'undefined', description: 'Extra CSS class(es) applied to the <th> element.', kind: 'Input' },
    { name: 'style', type: 'string | undefined', default: 'undefined', description: 'Inline style applied to the <th> element.', kind: 'Input' },
  ];

  // ── API rows — rlb-dt-row ─────────────────────────────────────────────────
  rowApi: DocApiRow[] = [
    { name: 'class', type: 'string | undefined', default: 'undefined', description: 'Extra CSS class(es) applied to the <tr> element.', kind: 'Input' },
    { name: 'style', type: 'string | undefined', default: 'undefined', description: 'Inline style applied to the <tr> element.', kind: 'Input' },
    { name: 'row-click', type: 'MouseEvent', description: 'Emitted when the user clicks anywhere on the row.', kind: 'Output' },
  ];

  // ── API rows — rlb-dt-cell ────────────────────────────────────────────────
  cellApi: DocApiRow[] = [
    { name: 'col-span', type: 'number | undefined', default: 'undefined', description: 'HTML colspan applied to the <td> element.', kind: 'Input' },
    { name: 'class', type: 'string | undefined', default: 'undefined', description: 'Extra CSS class(es) applied to the <td> element.', kind: 'Input' },
    { name: 'style', type: 'string | undefined', default: 'undefined', description: 'Inline style applied to the <td> element.', kind: 'Input' },
  ];

  // ── API rows — rlb-dt-actions ─────────────────────────────────────────────
  actionsApi: DocApiRow[] = [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire actions dropdown button. Auto-disabled when all child actions are disabled.', kind: 'Input' },
  ];

  // ── API rows — rlb-dt-action ──────────────────────────────────────────────
  actionApi: DocApiRow[] = [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this action item inside the dropdown.', kind: 'Input' },
    { name: 'routerLink', type: 'string | any[] | null | undefined', default: 'undefined', description: 'Angular router link applied to the action item.', kind: 'Input' },
    { name: 'click', type: 'MouseEvent', description: 'Emitted when the user clicks this action item.', kind: 'Output' },
  ];

  // ── API rows — rlb-dt-noitems ─────────────────────────────────────────────
  noItemsApi: DocApiRow[] = [
    { name: '(default)', type: 'ng-content', description: 'Content projected into the empty-state slot, shown when items is empty and loading is false.', kind: 'Content' },
  ];

  // ── API rows — rlb-dt-loading ─────────────────────────────────────────────
  loadingApi: DocApiRow[] = [
    { name: '(default)', type: 'ng-content', description: 'Content projected into the loading slot, shown when loading is true.', kind: 'Content' },
  ];
}
