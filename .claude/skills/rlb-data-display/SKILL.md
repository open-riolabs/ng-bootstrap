---
name: rlb-data-display
description: Expert guidance for the @open-rlb/ng-bootstrap components that present data rather than collect it — rlb-stat tiles, rlb-timeline activity feeds, rlb-virtual-list for long lists, rlb-tree, rlb-command-palette, rlb-empty-state, rlb-list and rlb-list-item-image, rlb-chat-container, and the rlb-placeholder skeletons. Use when building dashboards, activity feeds, long or nested lists, empty states, loading skeletons, or a command palette.
---

# RLB ng-Bootstrap Data & Display Skill

The components that **show** things. Forms are the **rlb-inputs** skill; tables are
**rlb-datatable**; buttons, cards and navigation are **rlb-components**.

All use Angular signals and `ChangeDetectionStrategy.OnPush`. The library requires Angular 22.

---

## Stat tile (rlb-stat)

One number, with what it means and which way it is going.

```html
<rlb-stat
  label="Revenue"
  value="12.480 €"
  [delta]="12"
  delta-label="vs last month"
  icon="bi bi-cash-coin"
  [sparkline]="[12, 15, 14, 19, 18, 24, 27]"
/>

<!-- Down is the good news: the colour flips, the arrow does not. -->
<rlb-stat label="p95 latency" value="141 ms" [delta]="-22" invert-delta color="info" />

<rlb-stat label="Orders" value="—" loading loadingLabel="Loading orders" />
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | `''` | What the number is. |
| `value` | `string \| number` | `''` | **Already formatted.** A component cannot know whether `1234.5` is money, a count or a percentage, nor in which locale — formatting stays with the caller. |
| `delta` | `number` | — | The change; its sign picks the arrow and the colour. Left out (or `''`/`null`), nothing is drawn. |
| `delta-text` | `string` | — | How the change is written. Default is the delta with a sign and a `%`. |
| `delta-label` | `string` | — | The line underneath: «vs last month». |
| `invert-delta` | `boolean` | `false` | Down is good: churn, latency, cost. |
| `sparkline` | `number[]` | `[]` | Drawn once there are two points. Decoration — it is `aria-hidden`. |
| `icon` | `string` | — | Icon class. |
| `color` | `Color` | `'primary'` | |
| `flat` | `boolean` | `false` | No card chrome, for a tile already inside one. |
| `loading` | `boolean` | `false` | Skeleton instead of the value. |
| `loadingLabel` | `string` | `'Loading'` | *camelCase, no alias.* What a screen reader says while loading. |

The direction is never colour alone: an arrow and a sign carry it too.

---

## Timeline (rlb-timeline + rlb-timeline-item)

An activity feed, an audit log, the history of a record.

```html
<rlb-timeline group-by-day timezone="Europe/Rome" day-format="WL DD LM yyyy" locale="it">
  <rlb-timeline-item [time]="created" heading="Created" icon="bi bi-plus-lg">
    Mario opened the ticket.
  </rlb-timeline-item>
  <rlb-timeline-item [time]="escalated" heading="Escalated" color="warning">…</rlb-timeline-item>
  <rlb-timeline-item heading="Waiting" pending color="secondary">Not yet.</rlb-timeline-item>
</rlb-timeline>
```

**`rlb-timeline`**

| Input | Type | Default |
|---|---|---|
| `compact` | `boolean` | `false` |
| `group-by-day` | `boolean` | `false` |
| `timezone` | `string` | — (*no alias*; falls back to the date default) |
| `locale` | `string` | `'en'` |
| `time-format` | `string` | `'HH:mm'` |
| `day-format` | `string` | `'WL DD LM yyyy'` |

**`rlb-timeline-item`**: `heading` (string), `time` (`IDateTz | string`), `icon`, `color`
(`Color`, default `'primary'`), `pending` (boolean). The body is projected content.

Grouping is the reason this is a component rather than a `@for`: the day is worked out from local
midnight **in the timeline's timezone**. An entry at 00:30 in Rome is still the previous day in UTC,
and timezone-naive day maths files it under the wrong heading. An `IDateTz` is formatted by the
timeline and takes part in grouping; a plain `string` is printed as given and does not.

The formats are **date-tz patterns**, not Angular `DatePipe` ones — see the **date-tz** skill for
the token table.

---

## Virtual list (rlb-virtual-list)

A long list that renders only what is on screen, over the CDK's virtual scroller.

```html
<rlb-virtual-list [items]="rows()" [item-size]="52" height="22rem" (near-end)="loadMore()">
  <ng-template let-row let-i="index">
    <div class="px-3 py-2 border-bottom" style="height: 52px">{{ i + 1 }} — {{ row.name }}</div>
  </ng-template>
</rlb-virtual-list>
```

| Input / output | Type | Default | Notes |
|---|---|---|---|
| `items` | `readonly T[]` | `[]` | |
| `item-size` | `number` | `48` | Fixed row height in px. **It must match what the template renders**, or the scrollbar lies about the length of the list and rows overlap. |
| `height` | `string` | `'20rem'` | CSS length. Without a height there is nothing to scroll inside. |
| `bordered` | `boolean` | `true` | |
| `threshold` | `number` | `10` | How many rows from the end `(near-end)` fires. |
| `track-by` | `(index: number, item: T) => unknown` | the index | |
| `(near-end)` | `void` | | Fires once per arrival — **the caller must still ignore it while a page is in flight**, or a fast scroll asks for the same page three times. |
| `(scrolled-index)` | `number` | | First rendered row. |

The row template is projected as the only content, with `let-item` (the `$implicit` value) and
`let-i="index"`.

---

## Tree (rlb-tree)

Nested things that are data rather than navigation: categories, permissions, folders, an org chart.
`rlb-sidebar-item` also nests, but only as a menu.

```html
<rlb-tree
  [nodes]="catalogue"
  [(expanded)]="openIds"
  [(selected)]="chosenIds"
  [filter]="query()"
  (activated)="open($event)"
/>

<!-- Permissions: ticking a branch ticks everything under it. -->
<rlb-tree [nodes]="permissions" checkboxes [(selected)]="granted" />
```

```typescript
import { RlbTreeNode } from '@open-rlb/ng-bootstrap';

export interface RlbTreeNode {
  id: string;          // unique across the whole tree: state is remembered by it
  label: string;
  icon?: string;
  children?: RlbTreeNode[];
  disabled?: boolean;
}
```

| Input / output | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `readonly RlbTreeNode[]` | `[]` | Plain data. The tree keeps no copy and no state beyond what is bound. |
| `expanded` | `string[]` | `[]` | Open branches, by id. **Two-way** — put it in the URL if the page should come back the same. |
| `selected` | `string[]` | `[]` | Taken nodes, by id. **Two-way.** One without `checkboxes`, any number with. |
| `checkboxes` | `boolean` | `false` | A box on every node; a branch takes everything under it. |
| `branch-selectable` | `boolean` | **`true`** | Off, clicking a branch only opens it — for a tree whose branches are headings. |
| `filter` | `string` | `''` | Keeps the matches and the branches above them, and opens those branches: a hit inside a closed branch is a hit nobody finds. |
| `ariaLabel` | `string` | `'Tree'` | *camelCase, no alias.* |
| `expandLabel` / `collapseLabel` / `emptyLabel` | `string` | `'Expand'` / `'Collapse'` / `'Nothing here'` | *camelCase, no alias.* |
| `(activated)` | `RlbTreeNode` | | A label was clicked. Branches too. |

Methods: `toggle(id)`, `expandAll()`, `collapseAll()`, `check(node, checked)` and
`checkedState(node)` → `'true' | 'false' | 'mixed'`.

Two things it does that the hand-written version usually does not:

- A branch only some of whose children are ticked is **indeterminate**, not unticked. A half-ticked
  branch drawn as unticked is how «apply to all» quietly does the wrong thing.
- Ticking the last child by hand promotes the branch to fully ticked. A branch is in the selection
  exactly when all of it is, so the drawing and the value never disagree.

Helpers exported for the data itself: `flattenTree(nodes)`, `subtreeIds(node)` and
`idsMatching(nodes, predicate)` — the last returns `{ hits, open }`, the ids to show and the
branches to open for them.

⚠️ For a tree **inside a form control** use `rlb-tree-select` (**rlb-inputs** skill). Note the two
spell the branch input differently and default it differently: `rlb-tree` has
`branch-selectable` (default `true`), `rlb-tree-select` has `branches-selectable` (default
`false`).

---

## Command palette (rlb-command-palette)

Everything the application can do, one keystroke away. Mount it **once**, near the root, the way
`rlb-modal-container` is mounted; it renders nothing until it opens.

```html
<rlb-command-palette [commands]="commands" shortcut="mod+k" />
```

```typescript
import { RlbCommand } from '@open-rlb/ng-bootstrap';

readonly commands: RlbCommand[] = [
  {
    id: 'new-user',                 // stable: it is how «recent» remembers this command
    label: 'New user',
    group: 'Users',
    icon: 'bi bi-person-plus',
    keywords: ['create', 'add'],    // also searched: synonyms, the old name, an abbreviation
    shortcut: 'N',                  // shown only; the palette does not bind it
    run: () => this.router.navigate(['/users/new']),
  },
];
```

| Input / output | Type | Default | Notes |
|---|---|---|---|
| `commands` | `readonly RlbCommand[]` | `[]` | |
| `shortcut` | `string` | `'mod+k'` | *camelCase, no alias.* `mod` is Cmd on a Mac and Ctrl elsewhere, so one string covers both. Empty turns it off. |
| `disabled` | `boolean` | `false` | |
| `recent-count` | `number` | `3` | Recently used at the top when the box is empty. `0` turns it off. |
| `title` / `placeholder` / `emptyLabel` / `recentLabel` | `string` | `'Commands'` / `'Type a command…'` / `'Nothing matches'` / `'Recent'` | *camelCase, no alias.* |
| `(executed)` | `RlbCommand` | | Already run. |

Methods: `open()` / `close()`, to drive it from a button as well.

Matching is by subsequence — every letter of the query in order — so `dbs` finds «Dashboard
settings». Matches at a word boundary and consecutive matches score higher, and a shorter label wins
a tie (`scoreCommand` is exported if you need the same ranking elsewhere). Arrows move and wrap,
Enter runs, Escape closes. A `disabled` command stays out of the list until it is searched for.

⚠️ It is a CDK overlay: the app must load `@angular/cdk/overlay-prebuilt.css`. See **rlb-overlays**.

---

## Empty state (rlb-empty-state)

There is nothing here, said properly. `rlb-dt-noitems` only works inside the datatable; this is the
same idea everywhere else.

```html
<rlb-empty-state title="No users yet">
  Invite someone and they will show up here.
  <button actions rlb-button color="primary" size="sm">Invite</button>
</rlb-empty-state>

<rlb-empty-state variant="search" title="Nothing matches" size="sm">Try a shorter word.</rlb-empty-state>
<rlb-empty-state variant="error" title="Could not load" size="sm">Try again in a moment.</rlb-empty-state>
```

| Input | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | The line in bold. |
| `variant` | `'empty' \| 'search' \| 'error' \| 'custom'` | `'empty'` | Picks a fitting icon, so the common cases need no `icon`. |
| `icon` | `string` | — | An icon class, overriding the variant's. |
| `size` | `'sm' \| 'md'` | `'md'` | |

Default content is the sentence; project buttons with the **`actions`** attribute.

---

## List (rlb-list)

Bootstrap's list group, as components. `rlb-list` only projects `rlb-list-item` and
`rlb-list-item-image` — anything else in it is dropped.

```html
<rlb-list flush>
  <rlb-list-item active>Inbox</rlb-list-item>
  <rlb-list-item action>Archive</rlb-list-item>
  <rlb-list-item disabled>Spam</rlb-list-item>
</rlb-list>
```

| Component | Inputs |
|---|---|
| `rlb-list` | `disabled`, `numbered`, `flush`, `horizontal` — all `boolean`, all default `false`, none aliased. |
| `rlb-list-item` | `active`, `action` (hover/focus styling for a clickable row), `disabled`. `disabled` on the list disables every item. |

### rlb-list-item-image

A row that is a person or a thing: avatar, two lines, and a counter.

```html
<rlb-list-item-image
  avatar="/assets/mario.png"
  [avatar-size]="40"
  line-1="Mario Rossi"
  line-2="mario@example.com"
  [counter]="3"
  counter-color="danger"
  counter-pill
/>
```

Inputs: `username`, `avatar`, `icon`, `line-1`, `line-2`, `avatar-size` (`number`, default `50`),
`counter` (`number | string`), `counter-color` (`Color`), `counter-empty`, `counter-pill`,
`counter-border` (booleans, default `false`), plus `active` and `disabled`.

---

## Chat (rlb-chat-container + rlb-chat-item)

```html
<rlb-chat-container>
  @for (m of messages(); track m.id) {
    <rlb-chat-item
      [id]="m.id"
      [avatar]="m.avatar"
      [text]="m.text"
      [date-time]="m.when"
      [position]="m.mine ? 'right' : 'left'"
      can-reply
      (reply)="replyTo($event)"
      (reaction-click)="react(m, $event)"
    />
  }
</rlb-chat-container>
```

`rlb-chat-item` inputs: `id`, `avatar`, `text`, `date-time`, `position` (`'left' | 'right'`, default
`'left'`), `reaction`, `can-reply`, `hide-reaction-picker`, and for a quoted message
`replay-text`, `replay-subject`, `replay-id` (spelled «replay» in the API).

Outputs: `(reply)` → `string | undefined`, `(reaction-click)` → `string`, `(reaction-selector)` →
`VisibilityEventBase`.

---

## Placeholders (skeletons)

Skeleton loading state for content that has not arrived. `rlb-placeholder-text` for quick multi-line
blocks; `rlb-placeholder` + `rlb-placeholder-line` for custom layouts. Toggle with `@if (loading())`
— render the skeleton while loading, the real content otherwise.

```html
<!-- Quick multi-line text skeleton -->
<rlb-placeholder-text [lines]="3" animation="glow" />

<!-- Per-line widths: pass a string[] (falls back to 100% past the end) -->
<rlb-placeholder-text [lines]="3" [width]="['80%', '100%', '60%']" animation="glow" />

<!-- Custom layout -->
<rlb-placeholder animation="glow">
  <rlb-placeholder-line width="40%" height="28px" />
  <rlb-placeholder-line width="100%" />
  <rlb-placeholder-line width="80%" color="primary" size="sm" />
  <rlb-placeholder-line width="60%" [rounded]="false" />
</rlb-placeholder>

<!-- Skeleton-style any element via the directive -->
<span rlb-placeholder placeholder-animation="glow" style="width: 6rem">&nbsp;</span>
```

| Component | Inputs |
|---|---|
| `rlb-placeholder` | `animation` (`'glow' \| 'wave' \| 'none'`, default `'none'`) — applies it to the children. |
| `rlb-placeholder-line` | `width` (default `'100%'`), `height` (default `'1.5rem'`), `size` (`'xs' \| 'sm' \| 'md' \| 'lg'`, default `'md'`), `color` (default `'secondary'`), `rounded` (default `true`). |
| `rlb-placeholder-text` | `lines` (default `1`), `width` (`string` **or** `string[]`), `animation`, `size`, `color`, `height`, `rounded`. |
| `[rlb-placeholder]` | `placeholder-color` (`Color`), `placeholder-size`, `placeholder-animation` (`'glow' \| 'fade' \| 'none'` — note `fade`, not `wave`, on the directive). |

> Boolean inputs like `rounded` need a binding: `[rounded]="false"`, not a bare `rounded` attribute.

A fixed number of skeleton rows, e.g. matching a table page size:

```html
<rlb-placeholder animation="glow">
  @for (line of [].constructor(pageSize()); track $index) {
    <rlb-placeholder-line width="100%" />
  }
</rlb-placeholder>
```

---

## Choosing between them

| You have | Use |
|---|---|
| A handful of rows, fixed | `rlb-list` |
| Thousands of rows, one template | `rlb-virtual-list` |
| Rows with columns, sorting, paging | `rlb-dt-table` (**rlb-datatable**) |
| Nested data the user opens and ticks | `rlb-tree` |
| Nested data as a form value | `rlb-tree-select` (**rlb-inputs**) |
| Events in time | `rlb-timeline` |
| A single number | `rlb-stat` |
| Nothing to show | `rlb-empty-state` |
| Something to show, but not yet | `rlb-placeholder*` |
