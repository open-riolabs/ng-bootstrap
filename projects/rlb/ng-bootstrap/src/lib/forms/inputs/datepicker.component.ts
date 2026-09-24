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
import { DatePanelComponent } from './date-panel.component';
import { InputValidationComponent } from './input-validation.component';
import { DATE_PICKER_POSITIONS } from './date-picker-positions';

/**
 * Picks one day.
 *
 * The library had a whole calendar, a month grid and a timezone-aware date library, and no way to
 * let a user choose a date that was not the browser's native `<input type="date">` — which ignores
 * the timezone, looks different in every browser and knows nothing about `IDateTz`.
 *
 * The value is an `IDateTz` at local midnight of the chosen day, in this control's timezone. The
 * text box is editable: what is typed is parsed with `format`, and put back the way it was if it
 * does not parse or falls outside `min`/`max`.
 *
 * The panel is positioned with CDK Overlay, which needs `@angular/cdk/overlay-prebuilt.css` in the
 * application's styles.
 */
@Component({
  selector: 'rlb-datepicker',
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
        [selected]="value()"
        [min]="min()"
        [max]="max()"
        [show-today]="showToday()"
        [todayLabel]="todayLabel()"
        (daySelected)="onDayPicked($event)"
      />
    </ng-template>
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent, DatePanelComponent],
})
export class DatepickerComponent extends AbstractComponent<IDateTz | undefined> {
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

  /** How the date is written in the box, and how what is typed there is read back. */
  format = input('DD/MM/YYYY');
  locale = input('en');
  /** Left unset, the zone comes from `provideRlbDefaults({ date: { timezone } })`, else UTC. */
  timezone = input<string | undefined>(undefined);
  firstDayOfWeek = input(1, { alias: 'first-day-of-week', transform: numberAttribute });

  min = input<IDateTz | undefined>(undefined);
  max = input<IDateTz | undefined>(undefined);

  clearable = input(true, { transform: booleanAttribute });
  showToday = input(true, { alias: 'show-today', transform: booleanAttribute });

  openLabel = input('Open calendar');
  clearLabel = input('Clear date');
  todayLabel = input('Today');

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

  /**
   * The format `parse` is given.
   *
   * `toString` accepts `yyyy` and `YYYY` alike, but `parse` only understands the uppercase one and
   * silently reads a lowercase year as 1970. A caller writing the format should not have to know
   * that, so the year token is normalised on the way in.
   */
  private parseFormat = computed(() => this.format().replace(/y{2,4}/g, match => match.toUpperCase()));

  protected display = computed(() => {
    const current = this.value();
    if (!current) return '';
    return new DateTz(current).toString!(this.format(), this.locale());
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
    this.setValue(day);
    this.close();
    this.field()?.nativeElement.focus();
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

  /**
   * Reads back what was typed, and puts the box back the way it was when it cannot.
   *
   * Silently keeping a half-typed date would be worse than refusing it: the box would say one
   * thing and the form would hold another.
   */
  private commit(text: string) {
    const trimmed = text.trim();
    if (trimmed === this.display()) return;

    if (trimmed === '') {
      if (this.value()) this.setValue(undefined);
      return;
    }

    const parsed = this.parse(trimmed);
    if (!parsed) {
      this.restore();
      return;
    }
    this.setValue(parsed);
  }

  private parse(text: string): IDateTz | undefined {
    const tz = this.zone();
    let parsed: IDateTz;
    try {
      parsed = DateTz.parse(text, this.parseFormat(), tz);
    } catch {
      return undefined;
    }
    // `parse` is lenient, so the only trustworthy check is whether it writes back what it read.
    if (new DateTz(parsed).toString!(this.format(), this.locale()) !== text) return undefined;

    const day = new DateTz(startOfDayTs(parsed, tz), tz);
    const ts = startOfDayTs(day, tz);
    const min = this.min();
    const max = this.max();
    if (min && ts < startOfDayTs(min, tz)) return undefined;
    if (max && ts > startOfDayTs(max, tz)) return undefined;
    return day;
  }

  private restore() {
    const input = this.field()?.nativeElement;
    if (input) input.value = this.display();
  }

  override onWrite(): void {
    this.restore();
  }
}
