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
      description: 'Sets the pixel offset [x, y] of the dropdown menu relative to the trigger. When non-empty, Popper.js dynamic positioning is used.',
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
      description: 'Emitted when the dropdown visibility changes, mapped from the corresponding Bootstrap dropdown events.',
      kind: 'Output',
    },
  ];

  containerApi: DocApiRow[] = [
    {
      name: 'placement',
      type: "'left' | 'right'",
      description: 'Menu alignment relative to the trigger at all breakpoints.',
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
      description: 'Responsive menu alignment for large (lg) screens and up.',
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
