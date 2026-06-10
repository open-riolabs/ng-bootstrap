import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class AccordionsComponent {
  message = signal(0);

  onStatusChanged(_event: unknown, _i: number): void {
    this.message.update(n => n + 1);
  }

  basicExample = `<rlb-accordion>
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Second Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Second Body</span>
    </div>
  </div>
</rlb-accordion>`;

  flushExample = `<rlb-accordion [flush]="true">
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Second Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Second Body</span>
    </div>
  </div>
</rlb-accordion>`;

  alwaysOpenExample = `<rlb-accordion [always-open]="true">
  <div rlb-accordion-item>
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Second Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Second Body</span>
    </div>
  </div>
</rlb-accordion>`;

  expandedExample = `<rlb-accordion>
  <div rlb-accordion-item [expanded]="true">
    <rlb-accordion-header>Expanded by default</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>This item starts open.</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Collapsed by default</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>This item starts closed.</span>
    </div>
  </div>
</rlb-accordion>`;

  statusChangeExample = `<p>Status change count: {{ message() }}</p>
<rlb-accordion>
  <div rlb-accordion-item (statusChange)="onStatusChanged($event, 0)">
    <rlb-accordion-header>Accordion Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Toggle me to fire statusChange events.</span>
    </div>
  </div>
  <div rlb-accordion-item>
    <rlb-accordion-header>Second Header</rlb-accordion-header>
    <div rlb-accordion-body>
      <span>Accordion Body</span>
    </div>
  </div>
</rlb-accordion>`;

  accordionApi: DocApiRow[] = [
    { name: 'flush', type: 'boolean', default: 'false', description: 'Remove borders and rounded corners so the accordion renders edge-to-edge with its parent container.', kind: 'Input' },
    { name: 'always-open', type: 'boolean', default: 'false', description: 'Allow multiple items to be open simultaneously; opening one item will not collapse others.', kind: 'Input' },
    { name: 'id', type: 'string', description: 'Custom HTML id for the accordion element. An auto-generated id is used when omitted.', kind: 'Input' },
    { name: 'card-style', type: 'boolean', default: 'true', description: 'Apply the card-style appearance class to the accordion wrapper.', kind: 'Input' },
  ];

  accordionItemApi: DocApiRow[] = [
    { name: 'name', type: 'string', description: 'Custom identifier for the accordion item used to link the header toggle and body panel. Auto-generated when omitted.', kind: 'Input' },
    { name: 'expanded', type: 'boolean', default: 'false', description: 'Set to true to expand this item on initial render.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS class(es) applied to the accordion item host element.', kind: 'Input' },
    { name: 'style', type: 'string', description: 'Inline style string applied to the accordion item host element.', kind: 'Input' },
    { name: 'statusChange', type: "EventEmitter<'hide' | 'hidden' | 'show' | 'shown' | 'hidePrevented'>", description: 'Emitted on every Bootstrap collapse lifecycle transition of this item.', kind: 'Output' },
    { name: 'open()', type: 'void', description: 'Programmatically expand the accordion item.', kind: 'Method' },
    { name: 'close()', type: 'void', description: 'Programmatically collapse the accordion item.', kind: 'Method' },
    { name: 'toggle()', type: 'void', description: 'Programmatically toggle the expanded/collapsed state of the accordion item.', kind: 'Method' },
  ];
}
