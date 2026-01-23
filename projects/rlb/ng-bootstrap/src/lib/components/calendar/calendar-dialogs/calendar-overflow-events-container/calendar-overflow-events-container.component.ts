import { Component, OnInit } from "@angular/core";
import { CalendarEvent, IModal, ModalData, ModalDirective } from '../../../index';

import { RlbBootstrapModule } from "../../../../rlb-bootstrap.module";

@Component({
  standalone: true,
  template: `
		<div [class]="'modal-header' + headerColor">
		  <h5 class="modal-title">{{ data.title }}</h5>
		  <button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
		</div>
		<div class="modal-body">
		  <div class="d-flex flex-column gap-1 overflow-y-auto p-3" [style.height.rem]="containerHeightRem">
		    @for (event of data.content; track event) {
		      <rlb-card class="mb-0 shadow-lg rounded" [border]="event.color">
		        <rlb-card-body class="d-flex align-items-center justify-content-between">
		          <div>
		            <span rlb-badge pill [color]="event.color">&nbsp;</span>
		            <span>
		              {{ event.title }}
		            </span>
		          </div>
		          <div class="d-flex align-items-center gap-2">
		            <rlb-fab
		              (click)="closeDialog(event, 'edit')"
		              data-modal-reason="ok"
		              class="align-self-end"
		              size="xs"
		              outline
		              >
		              <i class="bi bi-pencil"></i>
		            </rlb-fab>
		            <rlb-fab
		              (click)="closeDialog(event, 'delete')"
		              data-modal-reason="ok"
		              class="align-self-end"
		              size="xs"
		              color="danger"
		              outline
		              >
		              <i class="bi bi-trash"></i>
		            </rlb-fab>
		          </div>
		        </rlb-card-body>
		      </rlb-card>
		    }
		  </div>
		</div>
		<div class="modal-footer">
		  <button
		    rlb-button
		    color="secondary"
		    data-modal-reason="cancel"
		    >
		    {{ 'Close' }}
		  </button>
		</div>
		`,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
  imports: [RlbBootstrapModule]
})
export class CalendarOverflowEventsContainerComponent implements IModal<CalendarEvent[], CalendarOverflowEventsDialogResult>, OnInit {
  data!: ModalData<CalendarEvent[]>;
  containerHeightRem = 25;
  result: CalendarOverflowEventsDialogResult = {
    action: '' as CalendarOverflowEventDialogActionType,
    event: undefined as unknown as CalendarEvent
  };

  get headerColor() {
    return this.data.type ? ` bg-${this.data.type}` : '';
  }

  get valid(): boolean {
    return true
  }

  ngOnInit() {
  }

  closeDialog(event: CalendarEvent, action: CalendarOverflowEventDialogActionType) {
    this.result = { event, action }
  }
}

export interface CalendarOverflowEventsDialogResult {
  action: CalendarOverflowEventDialogActionType,
  event: CalendarEvent
}

export type CalendarOverflowEventDialogActionType = 'delete' | 'edit'
