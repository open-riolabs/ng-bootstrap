import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { startOfDayTs } from '../../components/calendar/utils/calendar-date-utils';
import { addMonths, firstOfMonth, monthGrid } from './date-panel.component';
import { DateRangeComponent } from './date-range.component';
import { DatepickerComponent } from './datepicker.component';

const ROME = 'Europe/Rome';

/** 15 March 2026, 09:00 Rome. March is chosen on purpose: Italy changes clock in it. */
const MARCH_15 = () => DateTz.parse('2026-03-15 09:00:00', 'YYYY-MM-DD HH:mm:ss', ROME);

describe('The date helpers work on local days, not UTC ones', () => {
  it('finds the first of the month the user is looking at', () => {
    const first = firstOfMonth(MARCH_15(), ROME);

    expect(first.day).toBe(1);
    expect(first.month).toBe(2); // 0-based: March
    expect(first.year).toBe(2026);
  });

  /**
   * The trap this guards: date-tz's `set` and `add` are timezone-naive. Stepping a month with
   * them lands on the first of the *UTC* month, which east of London is the previous day.
   */
  it('steps whole months without drifting off local midnight', () => {
    const march = firstOfMonth(MARCH_15(), ROME);

    const april = addMonths(march, ROME, 1);
    expect([april.day, april.month, april.hour]).toEqual([1, 3, 0]);

    const february = addMonths(march, ROME, -1);
    expect([february.day, february.month, february.hour]).toEqual([1, 1, 0]);

    const nextJanuary = addMonths(march, ROME, 10);
    expect([nextJanuary.day, nextJanuary.month, nextJanuary.year]).toEqual([1, 0, 2027]);
  });

  it('survives the spring clock change, which happens inside this month', () => {
    const march = firstOfMonth(MARCH_15(), ROME);
    const days = monthGrid(march, ROME, 1);

    // Every cell is local midnight and exactly one day after the previous one.
    for (const day of days) {
      expect(day.hour).toBe(0);
      expect(day.minute).toBe(0);
    }
    expect(days.length).toBe(42);
  });

  it('lays the grid out from the first day of the week it was given', () => {
    const march = firstOfMonth(MARCH_15(), ROME);

    expect(monthGrid(march, ROME, 1)[0].dayOfWeek).toBe(1); // Monday
    expect(monthGrid(march, ROME, 0)[0].dayOfWeek).toBe(0); // Sunday
  });
});

@Component({
  imports: [DatepickerComponent, ReactiveFormsModule],
  template: `
    <rlb-datepicker
      [formControl]="control"
      [timezone]="zone()"
      format="DD/MM/YYYY"
      [min]="min()"
      [max]="max()"
    />
  `,
})
class PickerHost {
  picker = viewChild.required(DatepickerComponent);
  control = new FormControl<IDateTz | undefined>(undefined);
  zone = signal(ROME);
  min = signal<IDateTz | undefined>(undefined);
  max = signal<IDateTz | undefined>(undefined);
}

describe('DatepickerComponent', () => {
  let fixture: ComponentFixture<PickerHost>;
  let host: PickerHost;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const field = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const openButton = () =>
    fixture.nativeElement.querySelector('[aria-label="Open calendar"]') as HTMLButtonElement;
  const panel = () => document.querySelector('rlb-date-panel');
  const dayButton = (label: string) =>
    Array.from(document.querySelectorAll('rlb-date-panel tbody button')).find(
      b => b.textContent?.trim() === label && !(b as HTMLButtonElement).disabled,
    ) as HTMLButtonElement | undefined;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [PickerHost] });
    fixture = TestBed.createComponent(PickerHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(async () => {
    host.picker().close();
    await settle();
    TestBed.resetTestingModule();
  });

  it('starts empty and opens nothing on its own', () => {
    expect(field().value).toBe('');
    expect(panel()).toBeNull();
  });

  it('writes the value in the format it was given', async () => {
    host.control.setValue(MARCH_15());
    await settle();

    expect(field().value).toBe('15/03/2026');
  });

  it('gives back local midnight of the day that was clicked', async () => {
    host.control.setValue(MARCH_15());
    await settle();
    openButton().click();
    await settle();

    dayButton('20')!.click();
    await settle();

    const picked = host.control.value!;
    expect([picked.day, picked.month, picked.year]).toEqual([20, 2, 2026]);
    expect(picked.hour).toBe(0);
    expect(picked.minute).toBe(0);
    expect(startOfDayTs(picked, ROME)).toBe(picked.timestamp);
  });

  it('closes once a day is chosen', async () => {
    openButton().click();
    await settle();
    dayButton('10')!.click();
    await settle();

    expect(panel()).toBeNull();
  });

  it('reads back a date typed into the box', async () => {
    field().value = '04/07/2026';
    field().dispatchEvent(new Event('blur'));
    await settle();

    const typed = host.control.value!;
    expect([typed.day, typed.month, typed.year]).toEqual([4, 6, 2026]);
  });

  /** Keeping half a date would mean the box says one thing and the form holds another. */
  it('puts the box back when what was typed is not a date', async () => {
    host.control.setValue(MARCH_15());
    await settle();

    field().value = 'domani';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(field().value).toBe('15/03/2026');
    expect(host.control.value!.day).toBe(15);
  });

  it('empties the value when the box is emptied', async () => {
    host.control.setValue(MARCH_15());
    await settle();

    field().value = '';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(host.control.value).toBeUndefined();
  });

  it('refuses a typed date outside min and max', async () => {
    host.min.set(DateTz.parse('2026-03-10', 'YYYY-MM-DD', ROME));
    host.max.set(DateTz.parse('2026-03-20', 'YYYY-MM-DD', ROME));
    await settle();

    field().value = '01/01/2026';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(host.control.value).toBeFalsy();
    expect(field().value).toBe('');
  });

  it('greys out the days outside min and max', async () => {
    host.control.setValue(MARCH_15());
    host.min.set(DateTz.parse('2026-03-10', 'YYYY-MM-DD', ROME));
    host.max.set(DateTz.parse('2026-03-20', 'YYYY-MM-DD', ROME));
    await settle();
    openButton().click();
    await settle();

    expect(dayButton('5')).toBeUndefined();
    expect(dayButton('15')).toBeDefined();
    expect(dayButton('25')).toBeUndefined();
  });
});

@Component({
  imports: [DateRangeComponent, ReactiveFormsModule],
  template: `
    <rlb-date-range
      [formControl]="control"
      [timezone]="zone()"
      format="DD/MM/YYYY"
      separator=" - "
    />
  `,
})
class RangeHost {
  range = viewChild.required(DateRangeComponent);
  control = new FormControl<{ start?: IDateTz; end?: IDateTz } | undefined>(undefined);
  zone = signal(ROME);
}

describe('DateRangeComponent', () => {
  let fixture: ComponentFixture<RangeHost>;
  let host: RangeHost;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const openButton = () =>
    fixture.nativeElement.querySelector('[aria-label="Open calendar"]') as HTMLButtonElement;
  const field = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
  const panel = () => document.querySelector('rlb-date-panel');
  const dayButton = (label: string) =>
    Array.from(document.querySelectorAll('rlb-date-panel tbody button')).find(
      b => b.textContent?.trim() === label && !(b as HTMLButtonElement).disabled,
    ) as HTMLButtonElement | undefined;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RangeHost] });
    fixture = TestBed.createComponent(RangeHost);
    host = fixture.componentInstance;
    host.control.setValue({ start: MARCH_15(), end: undefined });
    await settle();
    // Start from a clean sheet on the March grid.
    host.control.setValue(undefined);
    await settle();
  });

  afterEach(async () => {
    host.range().close();
    await settle();
    TestBed.resetTestingModule();
  });

  it('takes the first click as the start and stays open', async () => {
    openButton().click();
    await settle();

    dayButton('10')!.click();
    await settle();

    expect(host.control.value!.start!.day).toBe(10);
    expect(host.control.value!.end).toBeUndefined();
    expect(panel()).not.toBeNull();
  });

  it('takes the second click as the end and closes', async () => {
    openButton().click();
    await settle();
    dayButton('10')!.click();
    await settle();
    dayButton('20')!.click();
    await settle();

    expect(host.control.value!.start!.day).toBe(10);
    expect(host.control.value!.end!.day).toBe(20);
    expect(panel()).toBeNull();
    expect(field().value).toContain(' - ');
  });

  /** Clicking before the start is not a mistake to reject: it is someone starting again. */
  it('treats a second click before the start as a new start', async () => {
    openButton().click();
    await settle();
    dayButton('20')!.click();
    await settle();
    dayButton('10')!.click();
    await settle();

    expect(host.control.value!.start!.day).toBe(10);
    expect(host.control.value!.end).toBeUndefined();
    expect(panel()).not.toBeNull();
  });
});
