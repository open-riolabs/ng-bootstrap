import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IModal, ModalData, ModalDirective } from '../components';
import { SearchModalInput } from './search-modal.data';
import { RlbBootstrapModule } from '../rlb-bootstrap.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ModalDirective, RlbBootstrapModule, FormsModule, CommonModule],
  template: ` <div class="modal-header">
      <h5 class="modal-title">{{ data.title }}</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        data-modal-reason="close"
      ></button>
    </div>
    <div class="modal-body">
      <h6>{{ data.content?.searchText }}</h6>
      <rlb-input
        class="search-input"
        [placeholder]="data.content?.placeholder"
        [(ngModel)]="searchText"
        (keyup.enter)="onEnter()"
      >
        <button
          #btn
          after
          rlb-button
          outline
          data-modal-reason="ok"
          (click)="textSel()"
        >
          <i class="bi bi-search"></i>
        </button>
      </rlb-input>
    </div>`,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class SearchModalComponent
  implements IModal<SearchModalInput, string>, OnInit
{
  @ViewChild('btn') btn!: ElementRef<HTMLElement>;

  data!: ModalData<SearchModalInput>;
  valid?: boolean = true;
  result?: string;
  searchText?: string;

  textSel() {
    this.result = this.searchText;
  }

  onEnter() {}

  ngOnInit(): void {}
}
