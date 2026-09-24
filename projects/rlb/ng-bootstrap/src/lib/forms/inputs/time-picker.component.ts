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
import { getToday, startOfDayTs } from '../../components/calendar/utils/calendar-date-utils';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RLB_ICONS } from '../../shared/icons';
import { AbstractComponent } from './abstract-field.component';
import { DATE_PICKER_POSITIONS } from './date-picker-positions';
import { InputValidationComponent } from './input-validation.component';

const MINUTE = 60_000;

/**
 * A time of day, on the same timezone-aware dates as the rest of the library.
 *
 * The value is an `IDateTz`: the day it already had, with the chosen hour and minute. The day is
 * kept because a time on its own is almost never what a form means — «the appointment is at 09:00»
 * is a moment, and which moment depends on the date and the zone.
 *
 * The time is set by adding minutes to **local** midnight, not with `set(9, 'hour')`: date-tz's
 * mutators work on the raw UTC timestamp, so `set` would land on 09:00 UTC — 10:00 in Rome in
 * summer, and a different day either side of midnight.
 */
@Component({
  selector: 'rlb-time-picker',
  template: `
    <div
      class="input-group"
      [class.input-group-sm]="size() === 'small'"
      [class.input-group-lg]="size() === 'large'"
    >
      <input
        #field
        type="text"
        class="form-control"
        autocomplete="off"
        [id]="id()"
        [value]="display()"
        [attr.name]="name() || null"
        [attr.placeholder]="placeholder() || format()"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (blur)="onBlur($event)"
        (keydown.enter)="onEnter($event)"
      />

      @if (clearable() && value() && !isDisabled() && !readonly()) {
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
        <i [class]="icons.clock" aria-hidden="true"></i>
      </button>
    </div>

    @if (showError()) {
      <rlb-input-validation [errors]="errors()" />
    }

    <ng-template #panel>
      <div
        class="card shadow rlb-time-panel"
        role="dialog"
        [attr.aria-label]="openLabel()"
      >
        <div class="card-body p-0 d-flex">
          <ul
            class="list-unstyled m-0 p-1 overflow-auto rlb-time-column"
            role="listbox"
            [attr.aria-label]="hoursLabel()"
          >
            @for (hour of hours(); track hour) {
              <li>
                <button
                  type="button"
                  class="btn btn-sm w-100 text-start"
                  [class]="hour === currentHour() ? 'btn-primary' : 'btn-link text-body text-decoration-none'"
                  role="option"
                  [attr.aria-selected]="hour === currentHour()"
                  (click)="pick(hour, currentMinute())"
                >
                  {{ two(hour) }}
                </button>
              </li>
            }
          </ul>

          <ul
            class="list-unstyled m-0 p-1 overflow-auto rlb-time-column border-start"
            role="listbox"
            [attr.aria-label]="minutesLabel()"
          >
            @for (minute of minutes(); track minute) {
              <li>
                <button
                  type="button"
                  class="btn btn-sm w-100 text-start"
                  [class]="minute === currentMinute() ? 'btn-primary' : 'btn-link text-body text-decoration-none'"
                  role="option"
                  [attr.aria-selected]="minute === currentMinute()"
                  (click)="pick(currentHour(), minute)"
                >
                  {{ two(minute) }}
                </button>
              </li>
            }
          </ul>
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .rlb-time-panel {
      width: 9rem;
    }
    .rlb-time-column {
      max-height: 14rem;
      flex: 1 1 0;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent],
})
export class TimePickerComponent extends AbstractComponent<IDateTz | undefined> {
  protected icons = inject(RLB_ICONS);
  private dateDefaults = inject(RLB_DEFAULTS).date;
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private elementRef = inject(ElementRef<HTMLElement>);

  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  size = input<'small' | 'large' | undefined>(undefined);
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });
  enableValidation = input(false, { alias: 'enable-validation', transform: booleanAttribute });

  format = input('HH:mm');
  locale = input('en');
  timezone = input<string | undefined>(undefined);

  /** Minutes between the choices in the right-hand column. */
  minuteStep = input(5, { alias: 'minute-step', transform: numberAttribute });
  clearable = input(true, { transform: booleanAttribute });

  openLabel = input('Open the clock');
  clearLabel = input('Clear time');
  hoursLabel = input('Hours');
  minutesLabel = input('Minutes');

  readonly isOpen = signal(false);

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panel');
  private field = viewChild<ElementRef<HTMLInputElement>>('field');
  private overlayRef?: OverlayRef;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected zone = computed(() => this.timezone() ?? this.dateDefaults.timezone);

  protected hours = computed(() => Array.from({ length: 24 }, (_, i) => i));
  protected minutes = computed(() => {
    const step = Math.max(1, this.minuteStep());
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  });

  /** The local hour and minute, read through the timezone-aware getters. */
  protected currentHour = computed(() => this.localPart('hour'));
  protected currentMinute = computed(() => this.localPart('minute'));

  private localPart(part: 'hour' | 'minute'): number {
    const value = this.value();
    if (!value) return 0;
    const local = value.cloneToTimezone!(this.zone());
    return (part === 'hour' ? local.hour : local.minute) ?? 0;
  }

  protected display = computed(() => {
    const value = this.value();
    if (!value) return '';
    return new DateTz(value).toString!(this.format(), this.locale());
  });

  protected two(value: number): string {
    return String(value).padStart(2, '0');
  }

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

  /**
   * Keeps the day and replaces the time.
   *
   * Built as local midnight plus the minutes of the day — never `set(hour)`, which would set the
   * UTC hour and silently shift the result by the offset.
   */
  pick(hour: number, minute: number) {
    const zone = this.zone();
    const anchor = this.value() ?? getToday(zone);
    const midnight = startOfDayTs(anchor, zone);
    this.setValue(new DateTz(midnight + (hour * 60 + minute) * MINUTE, zone));
  }

  clear() {
    this.setValue(undefined);
    this.touch();
  }

  protected onEnter(event: Event) {
    this.commit((event.target as HTMLInputElement).value);
  }

  protected onBlur(event: Event) {
    this.commit((event.target as HTMLInputElement).value);
    this.touch();
  }

  /** Reads `HH:mm` back, and puts the box the way it was when it is not one. */
  private commit(text: string) {
    const trimmed = text.trim();
    if (trimmed === this.display()) return;

    if (trimmed === '') {
      if (this.value()) this.setValue(undefined);
      return;
    }

    const match = /^(\d{1,2})\s*[:.]\s*(\d{1,2})$/.exec(trimmed);
    const hour = match ? Number(match[1]) : NaN;
    const minute = match ? Number(match[2]) : NaN;

    if (!match || hour > 23 || minute > 59) {
      const field = this.field();
      if (field) field.nativeElement.value = this.display();
      return;
    }

    this.pick(hour, minute);
  }

  override onWrite(): void {
    const field = this.field();
    if (field) field.nativeElement.value = this.display();
  }
}
