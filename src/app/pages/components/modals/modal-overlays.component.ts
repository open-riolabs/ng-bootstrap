import { Component, model, Signal, signal } from '@angular/core';
import { IModal, ModalDirective, RlbTreeNode } from '@open-rlb/ng-bootstrap';
import { IDateTz } from '@open-rlb/date-tz';

import { SHARED_IMPORTS } from '../../../shared-imports';

/**
 * A dialog whose contents open panels of their own.
 *
 * Every one of these is rendered by the CDK outside the dialog, and Bootstrap's focus trap pulls
 * anything outside straight back in — so until the overlay container was made to follow the open
 * dialog, none of them could be reached from the keyboard.
 */
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Panels inside a dialog</h5>
      <button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
    </div>

    <div class="modal-body d-flex flex-column gap-3">
      <p class="text-body-secondary mb-0">
        Open each of these and walk it with the arrow keys. They are drawn outside the dialog, and
        the focus stays in them.
      </p>

      <rlb-dropdown>
        <button rlb-button color="secondary" rlb-dropdown>A dropdown</button>
        <ul rlb-dropdown-menu>
          <li rlb-dropdown-item>First</li>
          <li rlb-dropdown-item>Second</li>
          <li rlb-dropdown-item>Third</li>
        </ul>
      </rlb-dropdown>

      <rlb-datepicker
        timezone="Europe/Rome"
        [ngModel]="day()"
        (ngModelChange)="day.set($event)"
        placeholder="A datepicker"
      />

      <rlb-tree-select [nodes]="nodes" placeholder="A tree select" [ngModel]="picked()" (ngModelChange)="picked.set($event)" />
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-modal-reason="cancel">Close</button>
    </div>
  `,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ModalOverlaysComponent implements IModal<any, any> {
  data!: Signal<any>;
  valid = model(true);
  result?: any;

  readonly day = signal<IDateTz | undefined>(undefined);
  readonly picked = signal<string | undefined>(undefined);

  readonly nodes: RlbTreeNode[] = [
    {
      id: 'hardware',
      label: 'Hardware',
      children: [
        { id: 'keyboards', label: 'Keyboards' },
        { id: 'monitors', label: 'Monitors' },
      ],
    },
    { id: 'services', label: 'Services' },
  ];
}
