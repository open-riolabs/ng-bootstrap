import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-collapse',
  templateUrl: './collapse.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class CollapesesComponent {
  message: number = 0;

  onStatusChange(event: any) {
    this.message++;
  }

  basicExample = `<button rlb-button toggle="collapse" toggle-target="collapse-basic">Toggle</button>
<rlb-collapse id="collapse-basic">
  <div class="mt-2 p-3 border rounded">
    This is the collapsible content. It can be any HTML you like.
  </div>
</rlb-collapse>`;

  horizontalExample = `<button rlb-button toggle="collapse" toggle-target="collapse-horizontal">Toggle horizontal</button>
<rlb-collapse id="collapse-horizontal" orientation="horizontal">
  <div class="p-3 border rounded" style="width: 14rem;">
    This panel collapses horizontally.
  </div>
</rlb-collapse>`;

  statusChangeExample = `<p>Events received: {{ message }}</p>
<button rlb-button toggle="collapse" toggle-target="collapse-status">Toggle</button>
<rlb-collapse id="collapse-status" (statusChange)="onStatusChange($event)">
  <div class="mt-2 p-3 border rounded">
    Toggle me to see statusChange events fire.
  </div>
</rlb-collapse>`;

  collapseApi: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Required unique identifier for the collapse panel. Must match the toggle-target value on the trigger button.',
      kind: 'Input',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'vertical'",
      description: 'Direction of the collapse animation. Use horizontal to animate width instead of height.',
      kind: 'Input',
    },
    {
      name: 'status',
      type: 'VisibilityEvent',
      description: "Imperative visibility trigger. Set to 'show' to open or 'hide' to close the panel programmatically.",
      kind: 'Input',
    },
    {
      name: 'statusChange',
      type: 'EventEmitter<VisibilityEvent>',
      description: "Emits Bootstrap lifecycle events: 'show', 'shown', 'hide', 'hidden', or 'hidePrevented'.",
      kind: 'Output',
    },
    {
      name: 'open()',
      type: 'void',
      description: 'Programmatically opens (shows) the collapse panel.',
      kind: 'Method',
    },
    {
      name: 'close()',
      type: 'void',
      description: 'Programmatically closes (hides) the collapse panel.',
      kind: 'Method',
    },
    {
      name: 'toggle()',
      type: 'void',
      description: 'Programmatically toggles the visibility of the collapse panel.',
      kind: 'Method',
    },
  ];

  toggleDirectiveApi: DocApiRow[] = [
    {
      name: 'toggle',
      type: "'offcanvas' | 'collapse' | 'tab' | 'pill' | 'dropdown' | 'buttons-group'",
      description: "Type of Bootstrap component to control. Use 'collapse' for collapse panels.",
      kind: 'Input',
    },
    {
      name: 'toggle-target',
      type: 'string',
      description: 'The id of the target element to toggle. Must match the id input of the target component.',
      kind: 'Input',
    },
    {
      name: 'collapsed',
      type: 'boolean',
      default: 'false',
      description: 'Initial collapsed state. When true, adds the collapsed CSS class and sets aria-expanded to false.',
      kind: 'Input',
    },
    {
      name: 'auto-close',
      type: "'default' | 'inside' | 'outside' | 'manual'",
      default: "'default'",
      description: "Controls the auto-close behaviour (maps to data-bs-auto-close). 'manual' disables auto-close entirely.",
      kind: 'Input',
    },
  ];
}
