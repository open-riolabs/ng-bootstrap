import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class DropdownsComponent {
  message: number = 0;

  onStatus(event: 'show' | 'shown' | 'hide' | 'hidden') {
    console.log('Dropdown status:', event);
    this.message++;
  }

  sampleExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown Button</button>
  <rlb-dropdown-container>
    <p>Custom content inside dropdown</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  directionExample = `<rlb-dropdown [direction]="'right'">
  <button rlb-button rlb-dropdown>Right-aligned Dropdown</button>
  <rlb-dropdown-container>
    <p>Dropdown content</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  autocloseExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown [auto-close]="'manual'">
    Manual Dropdown
  </button>
  <rlb-dropdown-container>
    <p>This dropdown won't auto-close.</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  itemsExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown List</button>
  <ul rlb-dropdown-menu>
    <li rlb-dropdown-item header>Header</li>
    <li rlb-dropdown-item active>Active Item</li>
    <li rlb-dropdown-item>Normal Item</li>
    <li rlb-dropdown-item disabled>Disabled Item</li>
    <li rlb-dropdown-item divider></li>
  </ul>
</rlb-dropdown>`;

  linksExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown Links</button>
  <ul rlb-dropdown-menu>
    <li rlb-dropdown-item link="/">Home (root path)</li>
    <li rlb-dropdown-item link="/getting-started">Getting started (Absolute path)</li>
    <li rlb-dropdown-item link="not-found">Not found (Relative path)</li>
  </ul>
</rlb-dropdown>`;

  offsetExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown [offset]="[10, 25]">
    Dropdown Button
  </button>
  <rlb-dropdown-container>
    <p>Custom content inside dropdown</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  placementExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown Button responsive placement</button>
  <rlb-dropdown-container [placement]="'right'" [placement-lg]="'left'">
    <p>Custom content inside dropdown</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  statusChangeExample = `<rlb-dropdown>
  <button rlb-button rlb-dropdown (status-changed)="onStatus($event)">Dropdown</button>
  <rlb-dropdown-container>Content</rlb-dropdown-container>
</rlb-dropdown>`;

  keyboardExample = `<!-- Nothing to turn on: every dropdown has this. -->
<rlb-dropdown>
  <button rlb-button rlb-dropdown>Menu</button>
  <ul rlb-dropdown-menu>
    <li rlb-dropdown-item>Rename</li>
    <li rlb-dropdown-item disabled>Move</li>
    <li rlb-dropdown-item>Duplicate</li>
    <li rlb-dropdown-item divider></li>
    <li rlb-dropdown-item>Delete</li>
  </ul>
</rlb-dropdown>`;

  overflowExample = `<!-- The menu is rendered in an overlay at the end of the body, so a scrolling
     box or a cell with overflow: hidden no longer clips it. -->
<div style="overflow: hidden; height: 120px">
  <rlb-dropdown>
    <button rlb-button rlb-dropdown>Inside an overflow: hidden box</button>
    <ul rlb-dropdown-menu>
      <li rlb-dropdown-item>You can still read this</li>
      <li rlb-dropdown-item>And this</li>
    </ul>
  </rlb-dropdown>
</div>`;

  dropdownApi: DocApiRow[] = [
    {
      name: 'direction',
      type: "'up' | 'down' | 'left' | 'right' | 'up-center' | 'down-center'",
      default: "'down'",
      description: "Controls the opening direction of the dropdown. 'up-center' and 'down-center' are custom extensions not present in native Bootstrap.",
      kind: 'Input',
    },
  ];

  triggerApi: DocApiRow[] = [
    {
      name: 'offset',
      type: 'number[]',
      default: '[]',
      description: 'Shifts the menu by [x, y] pixels from where it would sit. It used to double as the switch between static and dynamic positioning; there is only one mode now, so an offset is only ever an offset.',
      kind: 'Input',
    },
    {
      name: 'auto-close',
      type: "'default' | 'inside' | 'outside' | 'manual'",
      default: "'default'",
      description: "Controls when the dropdown closes. 'default' closes on inside or outside clicks; 'inside' closes only on inside clicks; 'outside' closes only on outside clicks; 'manual' requires programmatic closing.",
      kind: 'Input',
    },
    {
      name: 'status-changed',
      type: "'show' | 'shown' | 'hide' | 'hidden'",
      description: 'Emitted when the dropdown visibility changes. The same four moments as before, now raised by the overlay rather than by Bootstrap.',
      kind: 'Output',
    },
    {
      name: 'anchor',
      type: "'self' | 'parent'",
      default: "'self'",
      description: "What the menu lines up with. 'parent' is Bootstrap's data-bs-reference=\"parent\", and it is what a split button needs: its arrow is a sliver at the end of a button group, and a menu aligned to the sliver hangs off the side.",
      kind: 'Input',
    },
  ];

  containerApi: DocApiRow[] = [
    {
      name: 'placement',
      type: "'left' | 'right'",
      description: 'Menu alignment relative to the trigger at all breakpoints. The class is still written on the element, but the alignment itself is handed to the overlay — a menu the CDK has lifted out of the flow cannot be aligned by a class on its own box.',
      kind: 'Input',
    },
    {
      name: 'placement-sm',
      type: "'left' | 'right'",
      description: 'Responsive menu alignment for small (sm) screens and up.',
      kind: 'Input',
    },
    {
      name: 'placement-md',
      type: "'left' | 'right'",
      description: 'Responsive menu alignment for medium (md) screens and up.',
      kind: 'Input',
    },
    {
      name: 'placement-lg',
      type: "'left' | 'right'",
      description: 'Responsive menu alignment for large (lg) screens and up. The breakpoint is read through the CDK BreakpointObserver, so it keeps meaning what it meant.',
      kind: 'Input',
    },
    {
      name: 'placement-xl',
      type: "'left' | 'right'",
      description: 'Responsive menu alignment for extra-large (xl) screens and up.',
      kind: 'Input',
    },
    {
      name: 'placement-xxl',
      type: "'left' | 'right'",
      description: 'Responsive menu alignment for extra-extra-large (xxl) screens and up.',
      kind: 'Input',
    },
  ];

  itemApi: DocApiRow[] = [
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description: 'Highlights the item as the currently active selection.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the item, blocking interaction.',
      kind: 'Input',
    },
    {
      name: 'header',
      type: 'boolean',
      default: 'false',
      description: 'Renders the item as a non-interactive section header (dropdown-header).',
      kind: 'Input',
    },
    {
      name: 'divider',
      type: 'boolean',
      default: 'false',
      description: 'Renders a horizontal rule as a visual separator between items.',
      kind: 'Input',
    },
    {
      name: 'link',
      type: 'string',
      description: 'Router link path. When set the item is rendered as an anchor and routerLink is applied.',
      kind: 'Input',
    },
    {
      name: 'text-wrap',
      type: 'boolean',
      default: 'false',
      description: 'Applies Bootstrap text-wrap and text-break classes so long labels wrap instead of being clipped.',
      kind: 'Input',
    },
  ];
}
