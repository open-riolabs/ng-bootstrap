import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-sidebar-doc',
  templateUrl: './sidebar.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class SidebarsComponent {
  basicExample = `<rlb-sidebar [rounded]="true">
  <rlb-sidebar-item title="Example menu" />

  <rlb-sidebar-item label="Components" [badgeCounter]="3">
    <rlb-sidebar-item icon="bi bi-card-heading" link="/components/cards">Cards</rlb-sidebar-item>
    <rlb-sidebar-item icon="bi bi-bell" link="/components/toasts">Toasts</rlb-sidebar-item>
    <rlb-sidebar-item icon="bi bi-calendar4-range" link="/components/calendar">Calendar</rlb-sidebar-item>
  </rlb-sidebar-item>

  <rlb-sidebar-item icon="bi bi-house" link="/">Home</rlb-sidebar-item>
</rlb-sidebar>`;

  sidebarApi: DocApiRow[] = [
    { name: 'dark', type: 'boolean', default: 'true', description: 'Apply the dark theme via data-bs-theme="dark" on the host element.', kind: 'Input' },
    { name: 'rounded', type: 'boolean', default: 'false', description: 'Apply rounded corners to the sidebar container.', kind: 'Input' },
  ];

  sidebarItemApi: DocApiRow[] = [
    { name: 'title', type: 'string | undefined', description: 'Renders the item as a non-clickable section header when set.', kind: 'Input' },
    { name: 'label', type: 'string | undefined', description: 'Label text for a collapsible parent item (used when the item has nested children).', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', description: 'CSS icon class to display before the label, e.g. bi bi-house.', kind: 'Input' },
    { name: 'link', type: "any[] | string | null | undefined", description: 'Router link applied to a leaf item.', kind: 'Input' },
    { name: 'badgeCounter', type: 'number | undefined', description: 'Badge shown next to the item label when the value is greater than 0.', kind: 'Input' },
    { name: 'click', type: 'MouseEvent', description: 'Emitted when the item is clicked.', kind: 'Output' },
  ];
}
