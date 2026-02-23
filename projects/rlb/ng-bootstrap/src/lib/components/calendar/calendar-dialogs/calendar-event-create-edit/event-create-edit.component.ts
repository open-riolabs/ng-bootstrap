import { Component, computed, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RlbBootstrapModule } from '../../../../rlb-bootstrap.module';
import { UniqueIdService } from '../../../../shared/unique-id.service';
import { IModal } from '../../../modals/data/modal';
import { ModalData } from '../../../modals/data/modal-data';
import { ModalDirective } from '../../../modals/modal.directive';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';

@Component({
  standalone: true,
  imports: [RlbBootstrapModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form">
      <div [class]="'modal-header' + headerColor()">
        <h5 class="modal-title">
          @if (eventToEdit?.id) {
            Edit Event
          } @else {
            Create Event
          }
        </h5>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          data-modal-reason="close"
        ></button>
      </div>
      <div class="modal-body">
        <rlb-input
          formControlName="title"
          placeholder="Event Title"
          class="mb-3"
        >
          <label before>Title</label>
        </rlb-input>

        <div class="row mb-3">
          <div class="col">
            <rlb-input
              type="datetime-local"
              formControlName="start"
            >
              <label before>Start Date</label>
            </rlb-input>
          </div>
          <div class="col">
            <rlb-input
              type="datetime-local"
              formControlName="end"
            >
              <label before>End Date</label>
            </rlb-input>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col">
            <rlb-switch formControlName="allDay">
              <label before>All Day</label>
            </rlb-switch>
          </div>
          <div class="col">
            <rlb-select formControlName="color">
              <label before>Color</label>
              @for (c of colors; track c.value) {
                <rlb-option [value]="c.value">{{ c.name }}</rlb-option>
              }
            </rlb-select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary me-2"
          data-modal-reason="cancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-modal-reason="ok"
        >
          Save
        </button>
      </div>
    </div>
  `,
  hostDirectives: [
    {
      directive: ModalDirective,
      inputs: ['id', 'data-instance', 'data-options'],
    },
  ],
})
export class EventCreateEditComponent
  implements IModal<CalendarEvent | undefined, CalendarEvent>, OnInit, OnDestroy
{
  data = input<ModalData<CalendarEvent | undefined>>({} as any);
  result?: CalendarEvent;

  private _valid = signal(false);
  valid = this._valid.asReadonly();

  headerColor = computed(() => {
    return this.data()?.type ? ` bg-${this.data().type}` : '';
  });

  private destroy$ = new Subject<void>();
  public form!: FormGroup;
  public eventToEdit?: CalendarEvent;

  public colors = [
    { name: 'Primary', value: 'primary' },
    { name: 'Secondary', value: 'secondary' },
    { name: 'Success', value: 'success' },
    { name: 'Danger', value: 'danger' },
    { name: 'Warning', value: 'warning' },
    { name: 'Info', value: 'info' },
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
  ];

  constructor(
    private fb: FormBuilder,
    private unique: UniqueIdService,
  ) {}

  ngOnInit(): void {
    this.eventToEdit = this.data()?.content;
    this.form = this.fb.group({
      id: [this.eventToEdit?.id || this.unique.id],
      title: [this.eventToEdit?.title || '', Validators.required],
      start: [this.eventToEdit?.start || '', Validators.required],
      end: [this.eventToEdit?.end || '', Validators.required],
      allDay: [this.eventToEdit?.allDay || false],
      color: [this.eventToEdit?.color || 'primary'],
    });

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: CalendarEvent) => {
      this.result = this.handleFormValueChange(value);
      this._valid.set(!this.form.pristine && this.form.valid);
    });
  }

  private handleFormValueChange(value: CalendarEvent): CalendarEvent {
    return {
      ...value,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
