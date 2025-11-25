import { Component, OnDestroy, OnInit } from "@angular/core";
import { CalendarEvent, IModal, ModalData, ModalDirective } from '../../../index';
import { RlbBootstrapModule } from "../../../../rlb-bootstrap.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Color } from "../../../../shared/types";
import { Subject, takeUntil } from "rxjs";
import { UniqueIdService } from "../../../../shared/unique-id.service";
import { IDateTz } from "@open-rlb/date-tz";

@Component({
	standalone: true,
	template: `
		<div [class]="'modal-header' + headerColor">
      <h5 class="modal-title">{{ data.title }}</h5>
			<button type="button" class="btn-close" aria-label="Close" data-modal-reason="close"></button>
		</div>
    <div class="modal-body" [formGroup]="form">
      <rlb-input formControlName="title">
        <label before>Event title</label>
      </rlb-input>
      <rlb-input type="datetime-local" date-type="date-tz" formControlName="start">
        <label before class="mt-3">Event start</label>
      </rlb-input>
      <rlb-input type="datetime-local" date-type="date-tz" formControlName="end">
        <label before class="mt-3">Event end</label>
      </rlb-input>
      <rlb-select [placeholder]="'Choose event color'" formControlName="color">
        <label before class="mt-3">Event color</label>
        <ng-container *ngFor="let color of colors">
          <rlb-option [value]="color">
            {{ color }}
          </rlb-option>
        </ng-container>
      </rlb-select>
    </div>
		<div class="modal-footer">
      <button
        type="button"
        class="btn "
        data-modal-reason="cancel"
        [ngClass]="{ 'btn-secondary': !eventToEdit, 'btn-danger': eventToEdit }"
      >
        {{ eventToEdit ? 'Delete event' : 'Close' }}
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
  imports: [RlbBootstrapModule, CommonModule, ReactiveFormsModule],
})
export class EventCreateEditComponent implements IModal<CalendarEvent | undefined, CalendarEvent>, OnInit, OnDestroy {
  data!: ModalData<CalendarEvent>;
  result?: CalendarEvent;
  form!: FormGroup;
  colors: Color[] = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
    'light',
    'dark',
  ]

  eventToEdit!: CalendarEvent;

  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private unique: UniqueIdService) {
  }

  ngOnInit() {
    this.eventToEdit = this.data.content
    this.form = this.fb.group({
      id: [this.eventToEdit ? this.eventToEdit.id : this.unique.id],
      title: [this.eventToEdit ? this.eventToEdit.title : "", Validators.required],
      start: [this.eventToEdit ? this.eventToEdit.start : "", Validators.required],
      end: [this.eventToEdit ? this.eventToEdit.end : "", Validators.required],
      color: [this.eventToEdit ? this.eventToEdit.color : "", Validators.required],
    })

    this.form.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value: CalendarEvent) => {
      this.result = this.handleFormValueChange(value)
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  get headerColor() {
		return this.data.type ? ` bg-${this.data.type}` : '';
	}

  get valid(): boolean {
    return !this.form.pristine && this.form.valid
  }

  private handleFormValueChange(formValue: CalendarEvent): CalendarEvent {
    const start = this.roundToQuarter(formValue.start);
    const end = this.roundToQuarter(formValue.end);
    return {
      ...formValue,
      start,
      end
    } as CalendarEvent;
  }

  private roundToQuarter(date?: IDateTz): IDateTz | string {
    if (date) {
      const minutes = date.minute!;
      const roundedMinutes = Math.round(minutes / 15) * 15;
      return date.set!(roundedMinutes, 'minute');
    }

    return ""
  }
}
