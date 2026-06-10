import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-offcanvas',
  templateUrl: './offcanvas.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class OffcanvassComponent {
  message: number = 0;

  onStatusChenged(event: any, i: number) {
    this.message++;
  }

  sampleExample = `<button rlb-button toggle="offcanvas" toggle-target="off-1" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-1">
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Offcanvas Header</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  placementExample = `<button rlb-button toggle="offcanvas" toggle-target="off-2" class="me-2">Offcanvas End</button>
<rlb-offcanvas id="off-2" placement="end">
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Offcanvas Header End Placement</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>Offcanvas Body</rlb-offcanvas-body>
</rlb-offcanvas>`;

  responsiveExample = `<button rlb-button toggle="offcanvas" toggle-target="off-3" class="me-2 d-sm-none">Offcanvas</button>
<rlb-offcanvas id="off-3" responsive="sm" class="d-sm-none">
  <rlb-offcanvas-header [offcanvasId]="'off-3'">
    <h5 rlb-offcanvas-title>Offcanvas Header Responsive</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>Resize the window below sm to see this offcanvas.</rlb-offcanvas-body>
</rlb-offcanvas>`;

  closeManualExample = `<button rlb-button toggle="offcanvas" toggle-target="off-4" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-4" close-manual>
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Offcanvas Header Manual Close</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>
    This offcanvas uses a static backdrop — clicking outside will not close it.
    Use the close button inside the header to dismiss it.
  </rlb-offcanvas-body>
</rlb-offcanvas>`;

  statusChangeExample = `<button rlb-button toggle="offcanvas" toggle-target="off-5" class="me-2">Offcanvas</button>
<rlb-offcanvas id="off-5" (statusChange)="onStatusChenged($event, 0)">
  <rlb-offcanvas-header>
    <h5 rlb-offcanvas-title>Offcanvas Header Status Change</h5>
  </rlb-offcanvas-header>
  <rlb-offcanvas-body>Status changed {{ message }} time(s).</rlb-offcanvas-body>
</rlb-offcanvas>`;

  apiRows: DocApiRow[] = [
    { name: 'id', type: 'string', description: 'Required unique identifier for the offcanvas panel. Must match the toggle-target on the trigger element.', kind: 'Input' },
    { name: 'placement', type: "'start' | 'end' | 'top' | 'bottom'", default: "'start'", description: 'Side of the viewport from which the offcanvas slides in.', kind: 'Input' },
    { name: 'responsive', type: "'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined", default: 'undefined', description: 'Breakpoint below which the component behaves as an offcanvas; at or above the breakpoint it is always visible.', kind: 'Input' },
    { name: 'body-scroll', type: 'boolean', default: 'false', description: 'Allow scrolling of the page body while the offcanvas is open.', kind: 'Input' },
    { name: 'scroll-backup', type: 'boolean', default: 'false', description: 'Preserve and restore the body scroll position when the offcanvas closes.', kind: 'Input' },
    { name: 'close-manual', type: 'boolean', default: 'false', description: 'When true, sets a static backdrop so clicking outside does not close the offcanvas, and disables keyboard (Esc) dismissal.', kind: 'Input' },
    { name: 'statusChange', type: "VisibilityEvent", description: "Emits Bootstrap visibility lifecycle events: 'show' | 'shown' | 'hide' | 'hidden' | 'hidePrevented'.", kind: 'Output' },
    { name: 'open()', type: 'void', description: 'Programmatically show the offcanvas.', kind: 'Method' },
    { name: 'close()', type: 'void', description: 'Programmatically hide the offcanvas.', kind: 'Method' },
    { name: 'toggle()', type: 'void', description: 'Programmatically toggle the offcanvas visibility.', kind: 'Method' },
  ];

  headerApiRows: DocApiRow[] = [
    { name: 'offcanvasId', type: 'string', default: "''", description: 'ID of the parent offcanvas. When provided, the built-in close button targets that specific panel via data-bs-target.', kind: 'Input' },
  ];

  titleApiRows: DocApiRow[] = [
    { name: '[rlb-offcanvas-title]', type: '—', description: 'Attribute directive applied to any heading element inside rlb-offcanvas-header. Adds the offcanvas-title Bootstrap class.', kind: 'Content' },
  ];
}
