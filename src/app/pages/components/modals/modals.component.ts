import { Component } from '@angular/core';
import { ModalService } from '@sicilyaction/lib-ng-bootstrap';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-modal',
  templateUrl: './modals.component.html',
  standalone: false
})
export class ModalsComponent {
  constructor(private modals: ModalService) {
  }

  dialog: string = `@Component({
standalone: true,
imports: [CommonModule, FormsModule],
  template: \`<div [class]="'modal-header' + headerColor">
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
</div> \`,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class ModalSampleComponent implements IModal<any, any> {
  data!: ModalData<any>;
  valid?: boolean = true;
  result?: any;

  get headerColor() {
    return this.data.type ? \` bg-\${this.data.type}\` : '';
  }
}`

  html: string = `<button rlb-button (click)="modal()" class="me-2">Open Modal</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './modals.component.html',
})
export class ModalsComponent {
  constructor(private modals: ModalService){
  }

  modal(): void {
  this.modals
    .openModal('sample-dialog', {
      title: 'Demo',
      content: 'This is a demo component',
      ok: 'OK',
      type: 'success',
    })
    .subscribe((o) => {
      console.log('closed sub', o);
    });
  }
}`;

  init: string = ` providers: [
    {
      provide: ModalRegistryOptions,
      useValue: {
        modals: {
          "sample-dialog": ModalSampleComponent,
          ...
        }
      },
      multi: true,
    },
  ]`;


  async modal() {
    
    const o = await lastValueFrom(this.modals
      .openModal('sample-dialog', {
        title: 'Demo',
        content: 'This is a demo component',
        ok: 'OK',
        type: 'success',
      }));
    console.log('closed sub', o);
  }

}

