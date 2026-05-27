# RLB ng-Bootstrap DataTable Skill

You are an expert in the **@open-rlb/ng-bootstrap** datatable component (`rlb-dt-table`). It supports pagination (pages or load-more), sorting, filtering, row actions, loading states, and empty states.

## Component Tree

```
rlb-dt-table
├── rlb-dt-header       — column header (sortable/filterable)
├── rlb-dt-row          — data row (repeated with *ngFor)
│   ├── rlb-dt-cell     — data cell
│   └── rlb-dt-actions  — row action menu
│       └── rlb-dt-action — individual action item
├── rlb-dt-loading      — custom loading template
└── rlb-dt-noitems      — custom empty state template
```

---

## rlb-dt-table Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | — | Table title |
| `items` | `any[]` | `[]` | Data rows |
| `loading` | `boolean` | `false` | Loading overlay |
| `card-style` | `boolean` | `true` | Wrap in card |
| `table-hover` | `boolean` | `false` | Hover highlight |
| `table-striped` | `boolean` | `false` | Alternating row colors |
| `table-striped-columns` | `boolean` | `false` | Alternating column colors |
| `table-bordered` | `boolean` | `false` | Cell borders |
| `table-borderless` | `boolean` | `false` | Remove all borders |
| `table-small` | `boolean` | `false` | Compact rows |
| `pagination-mode` | `'none'\|'load-more'\|'pages'` | `'none'` | Pagination strategy |
| `total-items` | `number` | — | Total record count |
| `current-page` | `number` | — | Current page (1-based) |
| `page-size` | `number` | — | Rows per page |
| `show-refresh` | `boolean` | `false` | Show refresh button |
| `show-actions` | `'row'\|'head'` | `'row'` | Actions column position |
| `creation-strategy` | `'none'\|'modal'\|'page'` | `'none'` | Create button behavior |
| `creation-url` | `any[]\|string\|null` | — | Router link for 'page' strategy |
| `load-more-label` | `string` | `'Load more'` | Load more button text |

## rlb-dt-table Outputs

| Output | Type | Description |
|--------|------|-------------|
| `create-item` | `void` | Fired when create button clicked |
| `refresh-item` | `void` | Fired when refresh button clicked |
| `load-more` | `void` | Fired when load-more clicked |
| `current-pageChange` | `number` | Two-way page binding |
| `page-sizeChange` | `number` | Two-way page-size binding |
| `pagination` | `{ page: number; size: number }` | Combined pagination event |

---

## rlb-dt-header Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `field` | `string` | — | Data field name (for sort/filter) |
| `sortable` | `boolean` | `false` | Enable column sorting |
| `filtrable` | `boolean` | `false` | Enable column filtering |
| `type` | `'number'\|'string'` | — | Column data type |
| `class` | `string` | — | CSS classes |
| `style` | `string` | — | Inline styles |

## rlb-dt-row Outputs

| Output | Type | Description |
|--------|------|-------------|
| `row-click` | `MouseEvent` | Row click event |

## rlb-dt-actions Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable all actions |

## rlb-dt-action Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | — | Action label (required) |
| `disabled` | `boolean` | `false` | Disable this action |

---

## Basic Table (no pagination)

```html
<rlb-dt-table
  title="Users"
  [items]="users"
  [loading]="loading"
  [table-hover]="true"
  [table-striped]="true"
  [show-refresh]="true"
  (refresh-item)="loadUsers()"
>
  <rlb-dt-header field="name" [sortable]="true">Name</rlb-dt-header>
  <rlb-dt-header field="email">Email</rlb-dt-header>
  <rlb-dt-header field="role">Role</rlb-dt-header>

  <rlb-dt-row *ngFor="let user of users" (row-click)="onRowClick(user)">
    <rlb-dt-cell>{{ user.name }}</rlb-dt-cell>
    <rlb-dt-cell>{{ user.email }}</rlb-dt-cell>
    <rlb-dt-cell>
      <span rlb-badge [color]="user.role === 'admin' ? 'danger' : 'primary'">{{ user.role }}</span>
    </rlb-dt-cell>
    <rlb-dt-actions>
      <rlb-dt-action label="Edit" (click)="editUser(user)"></rlb-dt-action>
      <rlb-dt-action label="Delete" (click)="deleteUser(user)" [disabled]="user.role === 'admin'"></rlb-dt-action>
    </rlb-dt-actions>
  </rlb-dt-row>

  <rlb-dt-noitems>
    <p class="text-muted text-center py-4">No users found.</p>
  </rlb-dt-noitems>
</rlb-dt-table>
```

---

## Server-side Pagination (pages)

```html
<rlb-dt-table
  title="Orders"
  [items]="orders"
  [loading]="loading"
  pagination-mode="pages"
  [total-items]="totalOrders"
  [(current-page)]="currentPage"
  [(page-size)]="pageSize"
  (pagination)="onPaginate($event)"
  creation-strategy="modal"
  (create-item)="openCreateModal()"
>
  <rlb-dt-header field="id" type="number">#</rlb-dt-header>
  <rlb-dt-header field="customer" [sortable]="true">Customer</rlb-dt-header>
  <rlb-dt-header field="amount" type="number" [sortable]="true">Amount</rlb-dt-header>
  <rlb-dt-header field="status">Status</rlb-dt-header>

  <rlb-dt-row *ngFor="let order of orders">
    <rlb-dt-cell>{{ order.id }}</rlb-dt-cell>
    <rlb-dt-cell>{{ order.customer }}</rlb-dt-cell>
    <rlb-dt-cell>{{ order.amount | currency:'EUR' }}</rlb-dt-cell>
    <rlb-dt-cell>
      <span rlb-badge [color]="statusColor(order.status)">{{ order.status }}</span>
    </rlb-dt-cell>
    <rlb-dt-actions>
      <rlb-dt-action label="View" (click)="viewOrder(order)"></rlb-dt-action>
      <rlb-dt-action label="Cancel" (click)="cancelOrder(order)" [disabled]="order.status !== 'pending'"></rlb-dt-action>
    </rlb-dt-actions>
  </rlb-dt-row>
</rlb-dt-table>
```

```typescript
@Component({ ... })
export class OrderListComponent {
  orders: Order[] = [];
  totalOrders = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;

  ngOnInit() { this.loadOrders(); }

  onPaginate({ page, size }: { page: number; size: number }) {
    this.currentPage = page;
    this.pageSize = size;
    this.loadOrders();
  }

  private loadOrders() {
    this.loading = true;
    this.orderService.getPage(this.currentPage, this.pageSize).subscribe(res => {
      this.orders = res.items;
      this.totalOrders = res.total;
      this.loading = false;
    });
  }

  statusColor(status: string): Color {
    const map: Record<string, Color> = {
      pending:   'warning',
      confirmed: 'primary',
      shipped:   'info',
      delivered: 'success',
      cancelled: 'danger'
    };
    return map[status] ?? 'secondary';
  }
}
```

---

## Load-more Pattern (infinite scroll style)

```html
<rlb-dt-table
  [items]="items"
  [loading]="loading"
  pagination-mode="load-more"
  [total-items]="total"
  load-more-label="Load more items"
  (load-more)="loadMore()"
>
  <rlb-dt-header>Name</rlb-dt-header>
  <rlb-dt-row *ngFor="let item of items">
    <rlb-dt-cell>{{ item.name }}</rlb-dt-cell>
  </rlb-dt-row>
</rlb-dt-table>
```

```typescript
page = 1;
items: any[] = [];
total = 0;

loadMore() {
  this.page++;
  this.service.getPage(this.page).subscribe(res => {
    this.items = [...this.items, ...res.items]; // append, don't replace
    this.total = res.total;
  });
}
```

---

## Custom Loading State

```html
<rlb-dt-table [items]="items" [loading]="loading">
  <!-- headers and rows... -->

  <rlb-dt-loading>
    <div class="d-flex justify-content-center p-4">
      <rlb-spinner color="primary" size="lg"></rlb-spinner>
    </div>
  </rlb-dt-loading>
</rlb-dt-table>
```

---

## Creation Strategies

```html
<!-- Modal: fires (create-item) output -->
<rlb-dt-table creation-strategy="modal" (create-item)="openCreateModal()">...</rlb-dt-table>

<!-- Page: navigates to route -->
<rlb-dt-table creation-strategy="page" creation-url="/users/new">...</rlb-dt-table>
<rlb-dt-table creation-strategy="page" [creation-url]="['/users', 'new']">...</rlb-dt-table>

<!-- None (default): no create button -->
<rlb-dt-table creation-strategy="none">...</rlb-dt-table>
```

---

## Table Style Combinations

```html
<!-- Compact bordered table -->
<rlb-dt-table [table-small]="true" [table-bordered]="true" [card-style]="false">

<!-- Striped hover table (most common for lists) -->
<rlb-dt-table [table-striped]="true" [table-hover]="true">

<!-- Borderless minimal table -->
<rlb-dt-table [table-borderless]="true" [card-style]="false">
```

---

## Best Practices

1. Always provide `[total-items]` when using `pagination-mode="pages"` — the paginator needs total count.
2. Use `[(current-page)]` and `[(page-size)]` for two-way binding; or listen to `(pagination)` for both at once.
3. Reset `currentPage = 1` whenever filters/sort change, then reload.
4. For append-style lists use `load-more` mode and concat arrays: `this.items = [...this.items, ...newItems]`.
5. Provide `<rlb-dt-noitems>` with a helpful message — empty tables are confusing without context.
6. Use `[disabled]` on `rlb-dt-action` for conditional actions (e.g., only admins can delete).
7. Avoid putting complex logic inside `*ngFor` templates — compute display values in the component.
