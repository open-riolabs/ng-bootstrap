import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class BadgesComponent {
  inlineExample = `<span rlb-badge>Default</span>
<span rlb-badge color="primary">Primary</span>
<span rlb-badge color="secondary">Secondary</span>
<span rlb-badge color="success">Success</span>
<span rlb-badge color="danger">Danger</span>
<span rlb-badge color="warning">Warning</span>
<span rlb-badge color="info">Info</span>
<span rlb-badge color="light">Light</span>
<span rlb-badge color="dark">Dark</span>`;

  softExample = `<span rlb-badge color="primary" [soft]="true">Primary</span>
<span rlb-badge color="secondary" [soft]="true">Secondary</span>
<span rlb-badge color="success" [soft]="true">Success</span>
<span rlb-badge color="danger" [soft]="true">Danger</span>
<span rlb-badge color="warning" [soft]="true">Warning</span>
<span rlb-badge color="info" [soft]="true">Info</span>
<span rlb-badge color="light" [soft]="true">Light</span>
<span rlb-badge color="dark" [soft]="true">Dark</span>`;

  pillExample = `<span rlb-badge color="primary" pill>Primary</span>
<span rlb-badge color="secondary" pill>Secondary</span>
<span rlb-badge color="success" pill>Success</span>
<span rlb-badge color="danger" pill>Danger</span>`;

  borderExample = `<span rlb-badge color="primary" border>Primary</span>
<span rlb-badge color="success" border>Success</span>`;

  textColorExample = `<span rlb-badge color="warning" badge-text-color="dark">Warning dark text</span>
<span rlb-badge color="light" badge-text-color="dark">Light dark text</span>`;

  attachedExample = `<button rlb-button class="position-relative" badge="New">Inbox</button>`;

  attachedPillExample = `<button rlb-button class="position-relative" badge="99" badge-pill>Alerts</button>`;

  attachedPositionExample = `<button rlb-button class="position-relative" badge="2" badge-top="0" badge-start="100">Messages</button>`;

  attachedBorderExample = `<button rlb-button class="position-relative" badge="5" badge-border>Settings</button>`;

  attachedDotExample = `<button rlb-button class="position-relative" badge-dot badge-top="0" badge-start="100" hidden-text="unread notifications">Notifications</button>`;

  badgeComponentApi: DocApiRow[] = [
    {
      name: 'color',
      type: 'Color | undefined',
      default: "'primary'",
      description: 'Bootstrap contextual background color of the badge.',
      kind: 'Input',
    },
    {
      name: 'pill',
      type: 'boolean',
      default: 'false',
      description: 'Render with rounded-pill style for a pill-shaped badge.',
      kind: 'Input',
    },
    {
      name: 'border',
      type: 'boolean',
      default: 'false',
      description: 'Add a border around the badge.',
      kind: 'Input',
    },
    {
      name: 'soft',
      type: 'boolean',
      default: 'false',
      description:
        'Render a soft (tinted surface + emphasis text) variant instead of a solid fill. Theme-aware and AA-legible in light and dark.',
      kind: 'Input',
    },
    {
      name: 'badge-text-color',
      type: 'string | undefined',
      default: '—',
      description: 'Bootstrap text color utility applied to the badge text (e.g. "dark").',
      kind: 'Input',
    },
    {
      name: 'hidden-text',
      type: 'string | undefined',
      default: '—',
      description:
        'Visually hidden text appended inside the badge for screen-reader accessibility.',
      kind: 'Input',
    },
    {
      name: 'class',
      type: 'string | undefined',
      default: '—',
      description: 'Additional CSS classes to append to the badge element.',
      kind: 'Input',
    },
  ];

  badgeDirectiveApi: DocApiRow[] = [
    {
      name: 'badge',
      type: 'string | number | undefined',
      default: '—',
      description:
        'Text or number shown inside the attached badge. When empty the badge is hidden.',
      kind: 'Input',
    },
    {
      name: 'badge-color',
      type: 'Color',
      default: "'danger'",
      description: 'Bootstrap contextual background color of the attached badge.',
      kind: 'Input',
    },
    {
      name: 'badge-pill',
      type: 'boolean',
      default: 'false',
      description: 'Render the attached badge with rounded-pill style.',
      kind: 'Input',
    },
    {
      name: 'badge-border',
      type: 'boolean',
      default: 'false',
      description: 'Add a border to the attached badge.',
      kind: 'Input',
    },
    {
      name: 'badge-top',
      type: 'number | undefined',
      default: '—',
      description:
        'Bootstrap top-{n} position offset for the badge (uses position-absolute + translate-middle). Accepts Bootstrap spacing tokens (0, 25, 50, 75, 100).',
      kind: 'Input',
    },
    {
      name: 'badge-start',
      type: 'number | undefined',
      default: '—',
      description:
        'Bootstrap start-{n} position offset for the badge. Works together with badge-top.',
      kind: 'Input',
    },
    {
      name: 'badge-text-color',
      type: 'string',
      default: "'dark'",
      description: 'Bootstrap text color utility applied to the badge text.',
      kind: 'Input',
    },
    {
      name: 'badge-dot',
      type: 'boolean',
      default: 'false',
      description:
        'Render a dot indicator instead of a text badge. No text is displayed; use hidden-text for accessibility.',
      kind: 'Input',
    },
    {
      name: 'badge-soft',
      type: 'boolean',
      default: 'false',
      description:
        'Render a soft (tinted surface + emphasis text) variant instead of a solid fill. Ignored for badge-dot, which stays solid.',
      kind: 'Input',
    },
    {
      name: 'hidden-text',
      type: 'string | undefined',
      default: '—',
      description: 'Visually hidden text inside the badge for screen-reader accessibility.',
      kind: 'Input',
    },
  ];
}
