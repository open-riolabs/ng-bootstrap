---
name: rlb-datatable
description: Expert guidance for the @open-rlb/ng-bootstrap rlb-dt-table datatable: server-side pagination (pages or load-more), per-column sorting and filtering through the (data-query) event, row selection with bulk actions, hideable columns, sticky header, CSV export, row actions, loading and empty states, labels/defaults. Use when building or configuring data tables.
---

# RLB ng-Bootstrap DataTable Skill

You are an expert in the **@open-rlb/ng-bootstrap** datatable component (`rlb-dt-table`). Requires Angular 22.

## The one thing to understand first

**The table never holds the rows.** Each `rlb-dt-row` is a template *you* project, so the table
cannot reorder, filter or page anything by itself. It tells you what the user asked for — page,
sort, filters — through **`(data-query)`**, and you answer by passing back the rows (from an API,
or computed over your own array). Sorting and filtering work exactly like pagination always did.

## Component Tree

```
rlb-dt-table
├── rlb-dt-header        — column header (sortable / filtrable / hideable)
├── rlb-dt-row           — data row (repeat it with @for)
│   ├── rlb-dt-cell      — data cell
│   └── rlb-dt-actions   — row action menu (⋯)
│       └── rlb-dt-action — one action (label = projected content)
├── rlb-dt-bulk-actions  — shown instead of the toolbar while rows are selected
├── rlb-dt-loading       — custom loading template
└── rlb-dt-noitems       — custom empty-state template
```

Import: every datatable component is standalone; `TABLE` (exported) is the array of all of
them — `imports: [...TABLE]` — or import the single ones (`DataTableComponent`, …).

---

## rlb-dt-table Inputs

⚠️ Most inputs are kebab-case aliases; a few have **no alias** and must be written camelCase
(marked *camel*).

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | — | Table title |
| `items` | `any[]` | `[]` | Data rows |
| `loading` | `boolean` | `false` | Loading overlay |
| `card-style` | `boolean` | `true` | Wrap in card |
| `table-hover` / `table-striped` / `table-striped-columns` | `boolean` | `false` | Bootstrap table styles |
| `table-bordered` / `table-borderless` / `table-small` | `boolean` | `false` | Bootstrap table styles |
| `pagination-mode` | `'none'\|'load-more'\|'pages'` | `'none'` | Pagination strategy |
| `total-items` | `number` | — | Total record count (required for `pages`) |
| `current-page` | `number` | — | Current page, **1-based**. Two-way with `[(current-page)]` |
| `page-size` | `number` | defaults `20` | Rows per page. Two-way with `[(page-size)]` |
| `page-sizes` | `number[]` | defaults `[10, 20, 50, 100]` | Choices in the page-size menu |
| `show-refresh` | `boolean` | `false` | Show refresh button |
| `showActions` *camel* | `'row'\|'head'` | `'row'` | Actions column position |
| `creation-strategy` | `'none'\|'modal'\|'page'` | `'none'` | Create button behavior |
| `creation-url` | `any[]\|string\|null` | — | Router link for `'page'` strategy |
| `sorting` | `TableSort \| undefined` | — | Active sort. **Two-way** `[(sorting)]` (e.g. keep it in the URL) |
| `filter` | `TableFilter` | `{}` | Typed filter values by `field`. **Two-way** `[(filter)]` |
| `filter-debounce` | `number` | `300` | ms after the last keystroke before a filter query is emitted |
| `selectable` | `boolean` | `false` | Adds a tick-box column; rows need `row-key` |
| `selection` | `unknown[]` | `[]` | Ticked rows, as their `row-key` values. **Two-way** `[(selection)]` |
| `show-columns` | `boolean` | `false` | Menu to hide/show columns marked `hideable` |
| `hiddenColumns` *camel* | `string[]` | `[]` | Hidden columns by `field`. **Two-way** `[(hiddenColumns)]` |
| `sticky-header` | `boolean` | `false` | Header stays while the body scrolls; needs `max-height` |
| `max-height` | `string` | — | CSS length the body scrolls inside (`60vh`, `400px`) |
| `show-export` | `boolean` | `false` | CSV export button |
| `export-mode` | `'client'\|'emit'` | `'client'` | `client` downloads the on-screen table; `emit` only fires `(export-csv)` (ask your server for the full set) |
| `export-filename` | `string` | `'export.csv'` | Downloaded file name |

### Labels (i18n / accessibility) — all *camel*, English defaults

`actionsLabel`, `loadMoreLabel`, `refreshLabel`, `createLabel`, `selectRowLabel`,
`selectAllLabel`, `columnsLabel`, `exportLabel`, `clearSelectionLabel`.

Precedence: the element's input → `provideRlbDefaults({ table: {...} })` → built-in English.
Set them once for the whole app instead of on every table:

```typescript
provideRlbDefaults({
  table: { pageSize: 25, pageSizes: [25, 50], actionsLabel: 'Azioni', sortLabel: 'Ordina' },
});
```

Icon-only buttons (refresh, create, sort, row actions) have no visible text: without a label a
screen reader only says «button».

## rlb-dt-table Outputs

| Output | Type | Description |
|--------|------|-------------|
| **`data-query`** | `TableDataQuery` | Page + sorting + filter together, on **every** change. Use this as soon as a column sorts or filters |
| `pagination` | `{ page: number; size: number }` | Page/size only (kept for tables that only page) |
| `current-pageChange` / `page-sizeChange` | `number` | Two-way bindings |
| `load-more` | `void` | Load-more clicked |
| `create-item` | `void` | Create button clicked (`'modal'` strategy) |
| `refresh-item` | `void` | Refresh clicked |
| `export-csv` | `string[][]` | The table as text rows, as on screen (hidden columns, tick boxes and actions left out). Fires in both export modes |

```typescript
import { TableDataQuery, TableSort, TableFilter } from '@open-rlb/ng-bootstrap';

type SortDirection = 'asc' | 'desc';
interface TableSort { column: string; direction: SortDirection }
interface TableFilter { [column: string]: number | string | boolean }
interface TableDataQuery {
  pagination?: { page?: number; size: number };
  sorting?: TableSort;
  filter?: TableFilter;
}
```

A new sort or filter **sends the table back to page 1** (it emits `current-pageChange: 1` and a
query with `page: 1`) — page 4 of the old order is not page 4 of the new one.

---

## rlb-dt-header Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `field` | `string` | — | Column key: used in `TableSort.column`, `TableFilter` keys, `hiddenColumns`. **Required** for sort/filter/hide |
| `sortable` | `boolean` | `false` | Sort button: none → `asc` → `desc` → none. Sets `aria-sort` |
| `filtrable` | `boolean` | `false` | Filter box under the heading (spelling: `filtrable`) |
| `hideable` | `boolean` | `false` | Can be hidden from the column menu (needs `field`) |
| `label` | `string` | `field` | Name in the column menu (the heading itself is projected and unreadable by the table) |
| `type` | `'number'\|'string'` | — | Column data type |
| `sortLabel` / `filterLabel` / `filterPlaceholder` *camel* | `string` | English | Accessible names |
| `class` / `style` | `string` | — | CSS |

## rlb-dt-row

| Input / Output | Type | Description |
|--------|------|-------------|
| `row-key` | `unknown` | What the row *is* for selection (id or object). Without it a selectable table shows no tick box on that row |
| `selectRowLabel` *camel* | `string` | Accessible name of the row's tick box — say which row («Seleziona Mario Rossi») |
| `class` / `style` | `string` | CSS |
| `(row-click)` | `MouseEvent` | Row click |

## rlb-dt-cell

`col-span` (number), `class`, `style`.

## rlb-dt-actions / rlb-dt-action

| Input | On | Description |
|-------|----|-------------|
| `disabled` | actions | Disable the whole menu |
| `label` | actions | `aria-label` of the ⋯ button — say what the row is: «Azioni per Mario Rossi» |
| `disabled` | action | Disable this action |
| `routerLink` | action | Navigate instead of handling `(click)` |
| `(click)` | action | `MouseEvent` |

⚠️ The action text is **projected content**, not an input: `<rlb-dt-action>Elimina</rlb-dt-action>`.

---

## Server-side table: page + sort + filter (recommended pattern)

```html
<rlb-dt-table
  title="Orders"
  [loading]="loading()"
  pagination-mode="pages"
  [total-items]="total()"
  [(current-page)]="page"
  [(page-size)]="size"
  (data-query)="load($event)"
  creation-strategy="modal"
  (create-item)="openCreateModal()"
>
  <rlb-dt-header field="number" type="number" sortable>#</rlb-dt-header>
  <rlb-dt-header field="customer" sortable filtrable>Customer</rlb-dt-header>
  <rlb-dt-header field="amount" type="number" sortable>Amount</rlb-dt-header>
  <rlb-dt-header field="status" filtrable>Status</rlb-dt-header>

  @for (order of orders(); track order._id) {
    <rlb-dt-row>
      <rlb-dt-cell>{{ order.number }}</rlb-dt-cell>
      <rlb-dt-cell>{{ order.customer }}</rlb-dt-cell>
      <rlb-dt-cell>{{ order.amount / 100 | currency: 'EUR' }}</rlb-dt-cell>
      <rlb-dt-cell>
        <span rlb-badge [color]="statusColor(order.status)">{{ order.status }}</span>
      </rlb-dt-cell>
      <rlb-dt-actions [label]="'Actions for order ' + order.number">
        <rlb-dt-action [routerLink]="['/orders', order._id]">View</rlb-dt-action>
        <rlb-dt-action (click)="cancel(order)" [disabled]="order.status !== 'pending'">Cancel</rlb-dt-action>
      </rlb-dt-actions>
    </rlb-dt-row>
  }

  <rlb-dt-noitems>
    <p class="text-muted text-center py-4">No orders found.</p>
  </rlb-dt-noitems>
</rlb-dt-table>
```

```typescript
@Component({ /* ..., */ changeDetection: ChangeDetectionStrategy.OnPush })
export class OrderListComponent {
  private readonly api = inject(OrderApiService);

  readonly orders = signal<Order[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  page = 1;
  size = 20;

  constructor() {
    this.load({ pagination: { page: 1, size: this.size } });
  }

  load(query: TableDataQuery) {
    this.loading.set(true);
    this.api.search(query).subscribe({
      next: res => {
        this.orders.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
```

The service maps `TableDataQuery` to the backend request (e.g. an RLB `*-filter-paginated`
action returning `PaginationModel<T> = { page, limit, total, data }`). Check whether the backend
`page` is 0- or 1-based — the table is **1-based**.

### Client-side (small, already-loaded arrays)

Answer the query over your own array: filter by `query.filter`, sort by `query.sorting`, slice by
`query.pagination`, then set the rows and `total-items` to the filtered length.

---

## Selection + bulk actions

```html
<rlb-dt-table selectable [(selection)]="selected" ...>
  <rlb-dt-bulk-actions>
    <button rlb-button color="danger" size="sm" (click)="deleteMany(selected)">Delete</button>
  </rlb-dt-bulk-actions>

  @for (u of users(); track u._id) {
    <rlb-dt-row [row-key]="u._id" [selectRowLabel]="'Select ' + u.name">...</rlb-dt-row>
  }
</rlb-dt-table>
```

`selection` holds exactly what you put in `row-key`. `rlb-dt-bulk-actions` replaces the toolbar
while the selection is non-empty. Clear it after a bulk action (`selected = []`).

## Columns, sticky header, export

```html
<rlb-dt-table show-columns [(hiddenColumns)]="hidden"
              sticky-header max-height="60vh"
              show-export export-filename="orders.csv">
  <rlb-dt-header field="notes" label="Notes" hideable>Notes</rlb-dt-header>
  ...
</rlb-dt-table>
```

`export-mode="client"` exports **only what is on screen** (current page). For the full data set use
`export-mode="emit"` and build the file server-side from `(export-csv)` / the current query.

## Load-more pattern

```html
<rlb-dt-table
  [loading]="loading()"
  pagination-mode="load-more"
  [total-items]="total()"
  loadMoreLabel="Load more items"
  (load-more)="loadMore()"
>
  <rlb-dt-header>Name</rlb-dt-header>
  @for (item of items(); track item._id) {
    <rlb-dt-row><rlb-dt-cell>{{ item.name }}</rlb-dt-cell></rlb-dt-row>
  }
</rlb-dt-table>
```

```typescript
loadMore() {
  this.page++;
  this.service.getPage(this.page).subscribe(res => {
    this.items.update(items => [...items, ...res.data]); // append, don't replace
    this.total.set(res.total);
  });
}
```

## Custom loading state

```html
<rlb-dt-loading>
  <div class="d-flex justify-content-center p-4">
    <rlb-spinner color="primary" size="lg"></rlb-spinner>
  </div>
</rlb-dt-loading>
```

## Creation strategies

```html
<rlb-dt-table creation-strategy="modal" (create-item)="openCreateModal()">...</rlb-dt-table>
<rlb-dt-table creation-strategy="page" [creation-url]="['/users', 'new']">...</rlb-dt-table>
<rlb-dt-table creation-strategy="none">...</rlb-dt-table>  <!-- default: no button -->
```

---

## Best Practices

1. Once any column is `sortable`/`filtrable`, listen to **`(data-query)`**, not `(pagination)`:
   page, sort and filters must travel together.
2. Always provide `[total-items]` with `pagination-mode="pages"`.
3. Give every sortable/filterable/hideable header a `field`.
4. Don't debounce filters yourself — `filter-debounce` already does (default 300 ms).
5. For append-style lists use `load-more` and concatenate.
6. Always provide `<rlb-dt-noitems>` with a helpful message.
7. Selectable tables: `row-key` on every row, `selectRowLabel` naming the row.
8. Set labels once via `provideRlbDefaults`, and give `rlb-dt-actions` a per-row `label`.
9. Use `[disabled]` on `rlb-dt-action` for conditional actions; `routerLink` for navigation.
10. Track rows by a stable id in `@for (...; track row._id)`; compute display values in the
    component, not in the template.
