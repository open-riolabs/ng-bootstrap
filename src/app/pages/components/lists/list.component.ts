import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ListsComponent {
  sampleExample = `<rlb-list>
  <rlb-list-item>Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  disabledListExample = `<rlb-list [disabled]="true">
  <rlb-list-item>Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  numberedExample = `<rlb-list [numbered]="true">
  <rlb-list-item>Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  flushExample = `<rlb-list [flush]="true">
  <rlb-list-item>Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  horizontalExample = `<rlb-list [horizontal]="true">
  <rlb-list-item>Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  activeItemExample = `<rlb-list>
  <rlb-list-item [active]="true">Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  disabledItemExample = `<rlb-list>
  <rlb-list-item [disabled]="true">Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  actionItemExample = `<rlb-list>
  <rlb-list-item [action]="true">Pippo</rlb-list-item>
  <rlb-list-item>Pluto</rlb-list-item>
  <rlb-list-item>Paperino</rlb-list-item>
</rlb-list>`;

  imageItemExample = `<rlb-list>
  <rlb-list-item-image
    username="Pippo"
    line-1="pippo&#64;example.com"
    avatar="https://i.pravatar.cc/50?img=1"
    [counter]="3"
    counter-color="primary"
    [counter-pill]="true">
  </rlb-list-item-image>
  <rlb-list-item-image
    username="Pluto"
    line-1="pluto&#64;example.com"
    avatar="https://i.pravatar.cc/50?img=2">
  </rlb-list-item-image>
  <rlb-list-item-image
    username="Paperino"
    line-1="paperino&#64;example.com"
    icon="bi bi-person-circle">
  </rlb-list-item-image>
</rlb-list>`;

  listApi: DocApiRow[] = [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all items in the list by adding the disabled class to the host element.', kind: 'Input' },
    { name: 'numbered', type: 'boolean', default: 'false', description: 'Renders a numbered list group (list-group-numbered).', kind: 'Input' },
    { name: 'flush', type: 'boolean', default: 'false', description: 'Removes outer borders and rounded corners to render list items edge-to-edge (list-group-flush).', kind: 'Input' },
    { name: 'horizontal', type: 'boolean', default: 'false', description: 'Displays list items in a horizontal row instead of vertically (list-group-horizontal).', kind: 'Input' },
  ];

  listItemApi: DocApiRow[] = [
    { name: 'active', type: 'boolean', default: 'false', description: 'Marks the item as the currently selected entry; sets the active class and aria-current attribute.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the item. Also inherited from the parent rlb-list when that is disabled.', kind: 'Input' },
    { name: 'action', type: 'boolean', default: 'false', description: 'Adds list-group-item-action to make the item interactive (hover and focus styles).', kind: 'Input' },
  ];

  listItemImageApi: DocApiRow[] = [
    { name: 'username', type: 'string | undefined', default: '—', description: 'Primary display name rendered in bold above the detail lines.', kind: 'Input' },
    { name: 'line-1', type: 'string | undefined', default: '—', description: 'First line of detail text shown below the username.', kind: 'Input' },
    { name: 'line-2', type: 'string | undefined', default: '—', description: 'Second line of detail text shown below line-1.', kind: 'Input' },
    { name: 'avatar', type: 'string | undefined', default: '—', description: 'URL of the avatar image. Rendered via rlb-avatar. Takes precedence over icon.', kind: 'Input' },
    { name: 'avatar-size', type: 'number', default: '50', description: 'Avatar image size in pixels.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: '—', description: 'CSS icon class (e.g. bi bi-person-circle) shown when no avatar URL is provided.', kind: 'Input' },
    { name: 'counter', type: 'number | string | undefined', default: '—', description: 'Counter value rendered as a badge on the right side of the item.', kind: 'Input' },
    { name: 'counter-color', type: 'Color | undefined', default: '—', description: 'Bootstrap contextual color applied to the counter badge.', kind: 'Input' },
    { name: 'counter-pill', type: 'boolean', default: 'false', description: 'Renders the counter badge as a pill shape.', kind: 'Input' },
    { name: 'counter-border', type: 'boolean', default: 'false', description: 'Adds a border to the counter badge.', kind: 'Input' },
    { name: 'counter-empty', type: 'boolean', default: 'false', description: 'Shows an empty badge dot even when counter has no value.', kind: 'Input' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Marks the item as active; sets the active class and aria-current attribute.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the item. Also inherited from the parent rlb-list when that is disabled.', kind: 'Input' },
  ];
}
