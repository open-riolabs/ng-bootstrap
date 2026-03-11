import { Component, computed, input } from '@angular/core';
import { RlbBootstrapModule } from '../../../../rlb-bootstrap.module';
import { IModal } from '../../../modals/data/modal';
import { ModalData } from '../../../modals/data/modal-data';
import { ModalDirective } from '../../../modals/modal.directive';
import {
  CalendarEvent,
  CalendarEventWithLayout,
} from '../../interfaces/calendar-event.interface';

export interface CalendarOverflowEventsDialogResult {
  action: 'edit' | 'delete' | 'close';
  event: CalendarEvent;
}

@Component({
  standalone: true,
  template: `
    <div [class]="'modal-header' + headerColor()">
      <h5 class="modal-title">{{ data().title }}</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        data-modal-reason="close"
      ></button>
    </div>
    <div class="modal-body">
      <div class="d-flex flex-column">
        @for (event of eventsWithLayout(); track event.id) {
          <div class="d-flex align-items-center mb-1">
            <rlb-calendar-event
              class="flex-grow-1"
              view="month"
              [event]="event"
            />
            <button
              class="btn btn-sm btn-outline-primary ms-1"
              data-modal-reason="ok"
              (click)="result = { action: 'edit', event: event }"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <button
              class="btn btn-sm btn-outline-danger ms-1"
              data-modal-reason="ok"
              (click)="result = { action: 'delete', event: event }"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        }
      </div>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-modal-reason="cancel"
      >
        Close
      </button>
    </div>
  `,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
  imports: [RlbBootstrapModule],
})
export class CalendarOverflowEventsContainerComponent implements IModal<
  CalendarEvent[],
  CalendarOverflowEventsDialogResult
> {
  data = input<ModalData<CalendarEvent[]>>({} as any);
  result?: CalendarOverflowEventsDialogResult;

  eventsWithLayout = computed(() => {
    return (this.data()?.content || []).map(
      (event) =>
        ({
          ...event,
          left: 0,
          width: 100,
        }) as CalendarEventWithLayout,
    );
  });

  headerColor = computed(() => {
    return this.data()?.type ? ` bg-${this.data().type}` : '';
  });
}
