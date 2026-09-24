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

  popoverTitleExample = `<button rlb-button color="success" [popover]="'Popover content goes here.'" popover-title="Popover title">With title</button>`;

  popoverPlacementExample = `<button rlb-button color="secondary" [popover]="'Top popover'" popover-placement="top">Top</button>
<button rlb-button color="secondary" [popover]="'Bottom popover'" popover-placement="bottom">Bottom</button>
<button rlb-button color="secondary" [popover]="'Left popover'" popover-placement="left">Left</button>
<button rlb-button color="secondary" [popover]="'Right popover'" popover-placement="right">Right</button>`;

  a11yTooltipExample = `<!-- Nothing to turn on. -->
<button rlb-button color="primary" tooltip="Reachable from the keyboard too">Tab to me</button>`;

  overflowTooltipExample = `<div style="overflow: hidden; height: 70px">
  <button rlb-button tooltip="Fully readable, outside the box" tooltip-placement="top">
    Inside an overflow: hidden box
  </button>
</div>`;

  tooltipApi: DocApiRow[] = [
    {
      name: 'tooltip',
      type: 'string | null | undefined',
      description: 'The text of the tooltip. Null or undefined turns it off — it refuses to open with nothing to say, and closes if the text is taken away while it is up. Changing it while it is up rewrites it in place.',
      kind: 'Input',
    },
    {
      name: 'tooltip-placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Preferred side, not a fixed one: with no room there the tooltip takes the opposite side, and data-popper-placement on the panel reports where it actually went, so the arrow follows.',
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
      description:
        'The body content of the popover. Bind it ([popover]), do not write it as a plain attribute: a static popover=... is also picked up by the browser as the native HTML popover attribute, which rejects the text value and puts the host into the native manual popover state. The user agent then hides it via display:none unless another rule (such as Bootstrap .btn) wins.',
      kind: 'Input',
    },
    {
      name: 'popover-placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Preferred side, not a fixed one: with no room there the popover takes another, and its arrow follows.',
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
    {
      name: 'aria-expanded',
      type: "'true' | 'false'",
      description: 'Written on the trigger while the card is up, so the button says what it does. A click anywhere else dismisses it, and so does Escape.',
      kind: 'Output',
    },
    {
      name: 'body content',
      type: 'text',
      description: 'The body is always written as text, never as markup: a card that opens on click is a bigger target than a label on hover. Use [tooltip] with tooltip-html if you really need markup.',
      kind: 'Content',
    },
  ];
}
