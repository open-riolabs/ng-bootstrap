import { Component, signal } from '@angular/core';
import { RlbTreeNode } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-tree-doc',
  templateUrl: './tree.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TreeDocComponent {
  readonly catalogue: RlbTreeNode[] = [
    {
      id: 'hardware',
      label: 'Hardware',
      icon: 'bi bi-cpu',
      children: [
        {
          id: 'laptops',
          label: 'Laptops',
          children: [
            { id: 'ultrabooks', label: 'Ultrabooks' },
            { id: 'workstations', label: 'Workstations' },
          ],
        },
        {
          id: 'peripherals',
          label: 'Peripherals',
          children: [
            { id: 'keyboards', label: 'Keyboards' },
            { id: 'mice', label: 'Mice' },
            { id: 'monitors', label: 'Monitors' },
          ],
        },
      ],
    },
    {
      id: 'software',
      label: 'Software',
      icon: 'bi bi-window-stack',
      children: [
        { id: 'licences', label: 'Licences' },
        { id: 'subscriptions', label: 'Subscriptions' },
        { id: 'discontinued', label: 'Discontinued', disabled: true },
      ],
    },
    { id: 'services', label: 'Services', icon: 'bi bi-headset' },
  ];

  readonly permissions: RlbTreeNode[] = [
    {
      id: 'orders',
      label: 'Orders',
      children: [
        { id: 'orders.read', label: 'Read' },
        { id: 'orders.write', label: 'Write' },
        { id: 'orders.delete', label: 'Delete' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      children: [
        { id: 'customers.read', label: 'Read' },
        { id: 'customers.write', label: 'Write' },
      ],
    },
  ];

  readonly expanded = signal<string[]>(['hardware']);
  readonly selected = signal<string[]>([]);
  readonly activated = signal<string | null>(null);

  readonly granted = signal<string[]>(['orders.read', 'customers.read']);

  readonly searchExpanded = signal<string[]>([]);
  readonly searchSelected = signal<string[]>([]);
  readonly query = signal('');

  basicExample = `<rlb-tree
  [nodes]="catalogue"
  [(expanded)]="expanded"
  [(selected)]="selected"
  (activated)="onActivated($event)"
/>`;

  checkboxExample = `<!-- Ticking a branch ticks everything under it; a part-ticked branch shows as mixed. -->
<rlb-tree [nodes]="permissions" checkboxes [(selected)]="granted" />`;

  filterExample = `<!-- The branches leading to a hit are opened, whether or not the user opened them. -->
<rlb-input placeholder="Search" [(ngModel)]="query" />
<rlb-tree [nodes]="catalogue" [filter]="query()" [(expanded)]="searchExpanded" />`;

  nodeExample = `export interface RlbTreeNode {
  /** Unique across the whole tree: expansion and selection are remembered by it. */
  id: string;
  label: string;
  icon?: string;
  children?: RlbTreeNode[];
  disabled?: boolean;
}`;

  api: DocApiRow[] = [
    { name: 'nodes', type: 'readonly RlbTreeNode[]', default: '[]', description: 'The tree. Plain data — the component holds no copy of it and no state of its own beyond what is bound.', kind: 'Input' },
    { name: 'expanded', type: 'string[]', default: '[]', description: 'Which branches are open, by id. Two-way, so a page can keep it in the URL.', kind: 'Two-way' },
    { name: 'selected', type: 'string[]', default: '[]', description: 'Which nodes are taken, by id. One id without checkboxes, any number with.', kind: 'Two-way' },
    { name: 'checkboxes', type: 'boolean', default: 'false', description: 'A tick box on every node, and a branch that ticks everything under it.', kind: 'Input' },
    { name: 'branch-selectable', type: 'boolean', default: 'true', description: 'Off, clicking a branch only opens it. For a category tree where the headings are not answers.', kind: 'Input' },
    { name: 'filter', type: 'string', default: "''", description: 'Shows only matching nodes, with the branches above them opened — a hit inside a closed branch is a hit nobody finds.', kind: 'Input' },
    { name: 'ariaLabel / expandLabel / collapseLabel / emptyLabel', type: 'string', description: 'Names the tree, the twisty buttons, and what is said when nothing is left to show.', kind: 'Input' },
    { name: 'activated', type: 'EventEmitter<RlbTreeNode>', description: 'A label was clicked. Fires for branches as well as leaves.', kind: 'Output' },
    { name: 'toggle(id) / expandAll() / collapseAll()', type: 'void', description: 'Drives expansion from code.', kind: 'Method' },
    { name: 'checkedState(node)', type: "'true' | 'false' | 'mixed'", description: 'Whether a node is ticked, with mixed for a branch only some of whose children are. Reported by the tree rather than inferred by the caller, because a half-ticked branch drawn as unticked is how «apply to all» quietly does the wrong thing.', kind: 'Method' },
    { name: 'check(node, checked)', type: 'void', description: 'Ticks or unticks a node and everything under it.', kind: 'Method' },
  ];

  onActivated(node: RlbTreeNode) {
    this.activated.set(node.label);
  }
}
