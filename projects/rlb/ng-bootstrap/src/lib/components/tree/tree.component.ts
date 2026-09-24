import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { flattenTree, idsMatching, RlbTreeNode, subtreeIds } from './tree-node';

interface Row {
  node: RlbTreeNode;
  depth: number;
  expandable: boolean;
  expanded: boolean;
}

/**
 * A tree of things: permissions, categories, an org chart.
 *
 * `rlb-sidebar-item` already nests, but only as navigation. This is the generic one — data in,
 * expansion and selection out, both two-way so a page can put them in the URL.
 *
 * With `checkboxes`, ticking a branch ticks everything under it, and a branch whose children are
 * only partly ticked shows as indeterminate rather than pretending to be one or the other.
 */
@Component({
  selector: 'rlb-tree',
  template: `
    <ul
      class="list-unstyled mb-0"
      role="tree"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-multiselectable]="checkboxes() ? true : null"
    >
      @for (row of rows(); track row.node.id) {
        <li
          role="treeitem"
          [attr.aria-level]="row.depth + 1"
          [attr.aria-expanded]="row.expandable ? row.expanded : null"
          [attr.aria-selected]="!checkboxes() ? isSelected(row.node.id) : null"
          [attr.aria-checked]="checkboxes() ? checkedState(row.node) : null"
          [attr.aria-disabled]="row.node.disabled ? true : null"
        >
          <div
            class="d-flex align-items-center gap-1 rounded px-1 py-1 rlb-tree-row"
            [class.bg-primary-subtle]="!checkboxes() && isSelected(row.node.id)"
            [style.padding-left.rem]="row.depth * 1.25"
          >
            @if (row.expandable) {
              <button
                type="button"
                class="btn btn-sm btn-link text-reset p-0 lh-1 rlb-tree-twisty"
                [attr.aria-label]="(row.expanded ? collapseLabel() : expandLabel()) + ' ' + row.node.label"
                (click)="toggle(row.node.id)"
              >
                <i [class]="row.expanded ? icons.chevronDown : icons.chevronRight" aria-hidden="true"></i>
              </button>
            } @else {
              <span class="rlb-tree-twisty" aria-hidden="true"></span>
            }

            @if (checkboxes()) {
              <input
                type="checkbox"
                class="form-check-input m-0 flex-shrink-0"
                [checked]="checkedState(row.node) === 'true'"
                [indeterminate]="checkedState(row.node) === 'mixed'"
                [disabled]="!!row.node.disabled"
                [attr.aria-label]="row.node.label"
                (change)="check(row.node, $any($event.target).checked)"
              />
            }

            <button
              type="button"
              class="btn btn-sm btn-link text-reset text-decoration-none text-start flex-grow-1 py-0 px-1"
              [disabled]="!!row.node.disabled"
              (click)="activate(row.node)"
            >
              @if (row.node.icon) {
                <i [class]="row.node.icon" class="me-1" aria-hidden="true"></i>
              }
              <span [class.fw-semibold]="isHit(row.node.id)">{{ row.node.label }}</span>
            </button>
          </div>
        </li>
      }
    </ul>

    @if (rows().length === 0) {
      <div class="text-body-secondary small px-2 py-3">{{ emptyLabel() }}</div>
    }
  `,
  styles: `
    .rlb-tree-twisty {
      width: 1.25rem;
      display: inline-flex;
      justify-content: center;
      flex-shrink: 0;
    }
    .rlb-tree-row:hover {
      background: var(--bs-secondary-bg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  protected icons = inject(RLB_ICONS);

  nodes = input<readonly RlbTreeNode[]>([]);

  /** Which branches are open, by id. Two-way. */
  expanded = model<string[]>([]);
  /** Which nodes are taken, by id. Two-way. One id without `checkboxes`, any number with. */
  selected = model<string[]>([]);

  /** Tick boxes, and a branch that ticks everything under it. */
  checkboxes = input(false, { transform: booleanAttribute });

  /**
   * Whether clicking a branch selects it as well as opening it.
   *
   * Off when only the leaves are real answers — a category tree where «Electronics» is a heading
   * and only «Headphones» is a thing you can choose.
   */
  branchSelectable = input(true, { alias: 'branch-selectable', transform: booleanAttribute });

  /**
   * Shows only the nodes matching this, with the branches above them opened — a hit inside a
   * closed branch is a hit nobody finds.
   */
  filter = input('');

  ariaLabel = input('Tree');
  expandLabel = input('Expand');
  collapseLabel = input('Collapse');
  emptyLabel = input('Nothing here');

  /** A node's label was clicked. Fires for branches as well as leaves. */
  activated = output<RlbTreeNode>();

  private search = computed(() => {
    const query = this.filter().trim().toLowerCase();
    if (query === '') return null;
    return idsMatching(this.nodes(), node => node.label.toLowerCase().includes(query));
  });

  protected isHit(id: string): boolean {
    const search = this.search();
    return !!search && search.hits.has(id);
  }

  /** The tree flattened to the rows actually on screen, each with the depth it is drawn at. */
  protected rows = computed<Row[]>(() => {
    const search = this.search();
    const open = new Set(this.expanded());
    const out: Row[] = [];

    const walk = (list: readonly RlbTreeNode[], depth: number) => {
      for (const node of list) {
        if (search && !search.hits.has(node.id)) continue;

        const children = node.children ?? [];
        const expandable = children.length > 0;
        // While searching, a branch leading to a hit is opened whether or not the user opened it.
        const expanded = expandable && (search ? search.open.has(node.id) : open.has(node.id));

        out.push({ node, depth, expandable, expanded });
        if (expanded) walk(children, depth + 1);
      }
    };

    walk(this.nodes(), 0);
    return out;
  });

  toggle(id: string) {
    const open = this.expanded();
    this.expanded.set(open.includes(id) ? open.filter(other => other !== id) : [...open, id]);
  }

  expandAll() {
    this.expanded.set(
      flattenTree(this.nodes())
        .filter(node => node.children?.length)
        .map(node => node.id),
    );
  }

  collapseAll() {
    this.expanded.set([]);
  }

  isSelected(id: string): boolean {
    return this.selected().includes(id);
  }

  /**
   * Whether a node is ticked, with `mixed` for a branch only some of whose leaves are.
   *
   * Reported on the branch itself rather than inferred by the caller, because a half-ticked branch
   * that renders as unticked is how «apply to all» quietly does the wrong thing.
   */
  checkedState(node: RlbTreeNode): 'true' | 'false' | 'mixed' {
    const ids = subtreeIds(node);
    const selected = this.selected();
    const taken = ids.filter(id => selected.includes(id)).length;
    if (taken === 0) return 'false';
    return taken === ids.length ? 'true' : 'mixed';
  }

  check(node: RlbTreeNode, checked: boolean) {
    const selected = new Set(this.selected());
    subtreeIds(node).forEach(id => (checked ? selected.add(id) : selected.delete(id)));
    this.reconcile(this.nodes(), selected);
    this.selected.set([...selected]);
  }

  /**
   * Puts every branch back in step with its children: in exactly when all of them are.
   *
   * Without this, ticking the last child by hand leaves the branch out of the selection and so
   * still drawn as half-ticked — the tree would be saying «some of these» while showing all of
   * them ticked. Depth first, so a branch is judged after the branches inside it.
   */
  private reconcile(list: readonly RlbTreeNode[], selected: Set<string>): void {
    for (const node of list) {
      const children = node.children ?? [];
      if (children.length === 0) continue;

      this.reconcile(children, selected);
      if (children.every(child => selected.has(child.id))) selected.add(node.id);
      else selected.delete(node.id);
    }
  }

  protected activate(node: RlbTreeNode) {
    if (node.disabled) return;

    // The label is the bigger target: clicking a branch opens it, as the twisty beside it does.
    const isBranch = !!node.children?.length;
    if (isBranch) this.toggle(node.id);

    if (!this.checkboxes() && (!isBranch || this.branchSelectable())) this.selected.set([node.id]);
    this.activated.emit(node);
  }
}
