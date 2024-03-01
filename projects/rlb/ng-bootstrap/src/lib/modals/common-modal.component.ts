import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IModal, ModalData, ModalDirective } from '../components';
import { SearchModalInput } from './search-modal.data';
import { RlbBootstrapModule } from '../rlb-bootstrap.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonModalData } from './common-modal.data';

@Component({
  standalone: true,
  imports: [ModalDirective, RlbBootstrapModule, FormsModule, CommonModule],
  template: `
    <div [class]="'modal-header' + headerColor">
      <h5 class="modal-title">{{ data.title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
    </div>
    <div class="modal-body">
      <h6 *ngIf="data.content?.header">
        {{ data.content?.header }}
      </h6>
      <span>
      {{ data.content?.body }}
      </span>
    </div>
    <div class="modal-footer">
      <button *ngIf="data.cancel" class="me-2" rlb-button outline data-modal-reason="cancel">
        {{ data.cancel }}
      </button>
      <button rlb-button data-modal-reason="ok" [disabled]="!valid">
        {{ data.ok }}
      </button>
    </div>
    `,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class CommonModalComponent
  implements IModal<CommonModalData, void>, OnInit {
  @ViewChild('btn') btn!: ElementRef<HTMLElement>;

  data!: ModalData<CommonModalData>;
  valid?: boolean = true;
  searchText?: string;

  get headerColor() {
    return this.data.type ? ` bg-${this.data.type}` : '';
  }

  onEnter() { }

  ngOnInit(): void { }
}
