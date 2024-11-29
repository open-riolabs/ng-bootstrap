import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IModal } from 'projects/rlb/ng-bootstrap/src/lib/components/modals/data/modal';
import { ModalData } from 'projects/rlb/ng-bootstrap/src/lib/components/modals/data/modal-data';
import { ModalDirective } from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
    imports: [CommonModule, FormsModule],
    template: `<div [class]="'modal-header' + headerColor">
  <h5 class="modal-title">Modal title</h5>
  <button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
</div>
<div class="modal-body">
  <p>Modal body text goes here.</p>
  <pre> {{ data | json }}</pre>
  <button (click)="valid = !valid">Change data</button>
  {{ valid }}
  <input [(ngModel)]="result" />
</div>
<div class="modal-footer">
  <button type="button" class="btn btn-secondary" data-modal-reason="cancel">
    Close
  </button>
  <button type="button" class="btn btn-primary" data-modal-reason="ok">
    Save changes
  </button>
</div>`,
    hostDirectives: [
        {
            directive: ModalDirective,
            inputs: ['id', 'data-instance', 'data-options'],
        },
    ]
})
export class ModalSampleComponent implements IModal<any, any> {
  data!: ModalData<any>;
  valid?: boolean = true;
  result?: any;

  get headerColor() {
    return this.data.type ? ` bg-${this.data.type}` : '';
  }
}