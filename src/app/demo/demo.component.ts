import { Component } from '@angular/core';
import { IModal } from 'projects/rlb/ng-bootstrap/src/lib/components/modals/data/modal';
import { ModalData } from 'projects/rlb/ng-bootstrap/src/lib/components/modals/data/modal-data';
import { ModalDirective } from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
    selector: 'app-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss'],
    hostDirectives: [
        {
            directive: ModalDirective,
            inputs: ['id', 'data-instance', 'data-options'],
        },
    ],
    standalone: false
})
export class DemoComponent implements IModal<any, any> {
  data!: ModalData<any>;
  valid?: boolean = true;
  result?: any;

  get headerColor() {
    return this.data.type ? ` bg-${this.data.type}` : '';
  }

}
