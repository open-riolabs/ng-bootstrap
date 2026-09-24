import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { startOfDayTs } from '../../components/calendar/utils/calendar-date-utils';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RLB_ICONS } from '../../shared/icons';
import { AbstractComponent } from './abstract-field.component';
import { DatePanelComponent, RlbDateRange } from './date-panel.component';
import { DATE_PICKER_POSITIONS } from './date-picker-positions';
import { InputValidationComponent } from './input-validation.component';

/**
 * Picks two days, from and to.
 *
 * The first click sets the start and clears whatever end there was; the second sets the end and
 * closes. A second click *before* the start is not an error — it is someone who meant to start
 * there, so it becomes the new start.
 *
 * Unlike `rlb-datepicker` the box is not typeable: a range in one line has no format that can be
 * read back without guessing where the middle is.
 */
@Component({
  selector: 'rlb-date-range',
  template: `
    <div
      class="input-group"
      [class.input-group-sm]="size() === 'small'"
      [class.input-group-lg]="size() === 'large'"
    >
      <input
        type="text"
        class="form-control"
        readonly
        autocomplete="off"
        [id]="id()"
        [value]="display()"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [style.cursor]="isDisabled() ? null : 'pointer'"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (click)="open()"
        (blur)="touch()"
      />

      @if (clearable() && hasValue() && !isDisabled()) {
        <button
          type="button"
          class="btn btn-outline-secondary"
          [attr.aria-label]="clearLabel()"
          (click)="clear()"
        >
          <i [class]="icons.close" aria-hidden="true"></i>
        </button>
      }

      <button
        type="button"
        class="btn btn-outline-secondary"
        [disabled]="isDisabled()"
        [attr.aria-label]="openLabel()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="dialog"
        (click)="toggle()"
      >
        <i [class]="icons.calendar" aria-hidden="true"></i>
      </button>
    </div>

    @if (showError()) {
      <rlb-input-validation [errors]="errors()" />
    }

    <ng-template #panel>
      <rlb-date-panel
        [timezone]="zone()"
        [locale]="locale()"
        [first-day-of-week]="firstDayOfWeek()"
        [range]="value()"
        [min]="min()"
        [max]="max()"
        [show-today]="false"
        (daySelected)="onDayPicked($event)"
      />
    </ng-template>
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent, DatePanelComponent],
})
export class DateRangeComponent extends AbstractComponent<RlbDateRange | undefined> {
  protected icons = inject(RLB_ICONS);
  private dateDefaults = inject(RLB_DEFAULTS).date;
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private elementRef = inject(ElementRef<HTMLElement>);

  disabled = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });
  enableValidation = input(false, { alias: 'enable-validation', transform: booleanAttribute });

  format = input('DD/MM/YYYY');
  /** What goes between the two dates in the box. */
  separator = input(' – ');
  locale = input('en');
  timezone = input<string | undefined>(undefined);
  firstDayOfWeek = input(1, { alias: 'first-day-of-week', transform: numberAttribute });

  min = input<IDateTz | undefined>(undefined);
  max = input<IDateTz | undefined>(undefined);

  clearable = input(true, { transform: booleanAttribute });
  openLabel = input('Open calendar');
  clearLabel = input('Clear dates');

  readonly isOpen = signal(false);

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panel');
  private overlayRef?: OverlayRef;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected zone = computed(() => this.timezone() ?? this.dateDefaults.timezone);
  protected hasValue = computed(() => !!this.value()?.start);

  protected display = computed(() => {
    const range = this.value();
    if (!range?.start) return '';
    const from = new DateTz(range.start).toString!(this.format(), this.locale());
    if (!range.end) return from;
    return from + this.separator() + new DateTz(range.end).toString!(this.format(), this.locale());
  });

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.overlayRef || this.isDisabled()) return;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(DATE_PICKER_POSITIONS)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });
    this.isOpen.set(true);
  }

  close() {
    if (!this.overlayRef) return;
    this.dispose();
    this.isOpen.set(false);
    this.touch();
  }

  private dispose() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  protected onDayPicked(day: IDateTz) {
    const tz = this.zone();
    const current = this.value();

    // Waiting for an end, and this one is not before the start: the range is complete.
    if (current?.start && !current.end && startOfDayTs(day, tz) >= startOfDayTs(current.start, tz)) {
      this.setValue({ start: current.start, end: day });
      this.close();
      return;
    }

    this.setValue({ start: day, end: undefined });
  }

  clear() {
    this.setValue(undefined);
    this.touch();
  }
}
