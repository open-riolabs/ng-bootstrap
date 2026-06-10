import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltips.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TooltipssComponent {
  basicTooltipExample = `<button rlb-button color="primary" [tooltip]="'Hello, I am a tooltip!'">Hover me</button>`;

  placementExample = `<button rlb-button color="secondary" tooltip="Top tooltip" tooltip-placement="top">Top</button>
<button rlb-button color="secondary" tooltip="Bottom tooltip" tooltip-placement="bottom">Bottom</button>
<button rlb-button color="secondary" tooltip="Left tooltip" tooltip-placement="left">Left</button>
<button rlb-button color="secondary" tooltip="Right tooltip" tooltip-placement="right">Right</button>`;

  htmlTooltipExample = `<button rlb-button color="info" tooltip="<strong>Bold</strong> and <em>italic</em> content" tooltip-html>HTML tooltip</button>`;

  customClassExample = `<button rlb-button color="dark" tooltip="Styled tooltip" tooltip-class="my-custom-tooltip">Custom class</button>`;

  basicPopoverExample = `<button rlb-button color="primary" [popover]="'This is a popover body.'">Click me</button>`;

  popoverTitleExample = `<button rlb-button color="success" popover="Popover content goes here." popover-title="Popover title">With title</button>`;

  popoverPlacementExample = `<button rlb-button color="secondary" popover="Top popover" popover-placement="top">Top</button>
<button rlb-button color="secondary" popover="Bottom popover" popover-placement="bottom">Bottom</button>
<button rlb-button color="secondary" popover="Left popover" popover-placement="left">Left</button>
<button rlb-button color="secondary" popover="Right popover" popover-placement="right">Right</button>`;

  tooltipApi: DocApiRow[] = [
    {
      name: 'tooltip',
      type: 'string | null | undefined',
      description: 'The text content of the tooltip. Pass null or undefined to disable the tooltip.',
      kind: 'Input',
    },
    {
      name: 'tooltip-placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Preferred placement of the tooltip relative to its host element.',
      kind: 'Input',
    },
    {
      name: 'tooltip-class',
      type: 'string',
      default: "''",
      description: 'Extra CSS class(es) added to the tooltip element for custom styling.',
      kind: 'Input',
    },
    {
      name: 'tooltip-html',
      type: 'boolean',
      default: 'false',
      description: 'When true, the tooltip content is rendered as HTML instead of plain text.',
      kind: 'Input',
    },
  ];

  popoverApi: DocApiRow[] = [
    {
      name: 'popover',
      type: 'string | undefined',
      description: 'The body content of the popover.',
      kind: 'Input',
    },
    {
      name: 'popover-placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Preferred placement of the popover relative to its host element.',
      kind: 'Input',
    },
    {
      name: 'popover-class',
      type: 'string',
      default: "''",
      description: 'Extra CSS class(es) added to the popover element for custom styling.',
      kind: 'Input',
    },
    {
      name: 'popover-title',
      type: 'string',
      default: "''",
      description: 'Optional title rendered in the popover header.',
      kind: 'Input',
    },
  ];
}
