import { Component } from '@angular/core';

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
  ];

  // ── API rows — rlb-dt-header ──────────────────────────────────────────────
  headerApi: DocApiRow[] = [
    { name: 'field', type: 'string | undefined', default: 'undefined', description: 'Data field name this column maps to (used for sorting).', kind: 'Input' },
    { name: 'type', type: "'number' | 'string' | undefined", default: 'undefined', description: 'Data type of the column, used when sorting.', kind: 'Input' },
    { name: 'sortable', type: 'boolean', default: 'false', description: 'Enables sort toggle on this column header.', kind: 'Input' },
    { name: 'filtrable', type: 'boolean', default: 'false', description: 'Enables filter input on this column.', kind: 'Input' },
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
