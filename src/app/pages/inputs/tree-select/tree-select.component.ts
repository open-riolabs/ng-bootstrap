import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RlbTreeNode } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-tree-select-doc',
  templateUrl: './tree-select.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TreeSelectDocComponent {
  readonly catalogue: RlbTreeNode[] = [
    {
      id: 'hardware',
      label: 'Hardware',
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
      children: [
        { id: 'licences', label: 'Licences' },
        { id: 'subscriptions', label: 'Subscriptions' },
      ],
    },
    { id: 'services', label: 'Services' },
  ];

  readonly category = signal<string | undefined>('monitors');
  readonly categories = signal<string[]>(['keyboards', 'mice']);
  readonly leafOnly = signal<string | undefined>(undefined);

  readonly reactive = new FormControl<string | undefined>('licences');

  basicExample = `<rlb-tree-select
  [nodes]="catalogue"
  placeholder="Category"
  [(ngModel)]="category"
/>`;

  multipleExample = `<!-- With multiple the value is a string[] and the panel grows tick boxes. -->
<rlb-tree-select
  [nodes]="catalogue"
  multiple
  placeholder="Categories"
  [(ngModel)]="categories"
/>`;

  leafExample = `<!-- Branches are headings here, not answers: clicking one only opens it. -->
<rlb-tree-select
  [nodes]="catalogue"
  [branches-selectable]="false"
  placeholder="Pick a leaf"
  [(ngModel)]="leafOnly"
/>`;

  reactiveExample = `readonly reactive = new FormControl<string | undefined>('licences');

<rlb-tree-select [nodes]="catalogue" [formControl]="reactive" />`;

  api: DocApiRow[] = [
    { name: 'nodes', type: 'readonly RlbTreeNode[]', default: '[]', description: 'The tree offered in the panel. Same shape as rlb-tree.', kind: 'Input' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Take several, with a tick box on every node and a branch that ticks what is under it. The value becomes a string[].', kind: 'Input' },
    { name: 'branches-selectable', type: 'boolean', default: 'false', description: 'Whether a branch is a possible answer. Off, clicking one only opens it.', kind: 'Input' },
    { name: 'searchable', type: 'boolean', default: 'true', description: 'A search box above the tree, which opens the branches leading to a hit.', kind: 'Input' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a button that empties the field.', kind: 'Input' },
    { name: 'placeholder', type: 'string', default: "'Choose…'", description: 'Shown while nothing is chosen.', kind: 'Input' },
    { name: 'searchPlaceholder / emptyLabel / clearLabel / removeLabel', type: 'string', description: 'Wording for the search box, the empty panel, the clear button and each chip’s remove button.', kind: 'Input' },
    { name: 'ariaLabel', type: 'string | undefined', default: 'undefined', description: 'Names the control and the tree inside the panel.', kind: 'Input' },
    { name: 'size / readonly / disabled / enable-validation', type: 'string | boolean', description: 'As on every other input in the library.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'string | string[] | undefined', description: 'Ids, not nodes — a form that round-trips through JSON should not carry whole subtrees with it. An id with no node behind it reads as nothing chosen.', kind: 'Two-way' },
    { name: 'open() / close() / toggle() / clear()', type: 'void', description: 'Drives the panel and the value from code.', kind: 'Method' },
  ];
}
