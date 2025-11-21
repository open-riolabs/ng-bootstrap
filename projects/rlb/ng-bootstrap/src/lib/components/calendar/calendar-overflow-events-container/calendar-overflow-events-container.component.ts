import { Component, OnInit } from "@angular/core";
import { CalendarEvent, IModal, ModalData, ModalDirective } from '../../index';
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  template: `
		<div [class]="'modal-header' + headerColor">
      <h5 class="modal-title">{{ data.title }}</h5>
			<button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
		</div>
    <div class="modal-body">
      <div class="d-flex flex-column gap-1">
        <div class="border"  *ngFor="let event of data.content">
          <span [ngClass]="'bg-' + event.color" >teest</span>
          {{event.title}}
        </div>
      </div>
    </div>
		<div class="modal-footer">
      <button
        type="button"
        class="btn "
        data-modal-reason="cancel"
      >
        {{ 'Close' }}
			</button>
      <button type="button" [disabled]="!valid" class="btn btn-primary" data-modal-reason="ok">
				Save changes
			</button>
		</div>
	`,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
  imports: [CommonModule]
})
export class CalendarOverflowEventsContainerComponent implements IModal<CalendarEvent[] , CalendarEvent[]>, OnInit {
  data!: ModalData<CalendarEvent[]>;

  get headerColor() {
    return this.data.type ? ` bg-${this.data.type}` : '';
  }

  get valid(): boolean {
    return true
  }

  ngOnInit() {
    console.log(this.data);
  }
}
