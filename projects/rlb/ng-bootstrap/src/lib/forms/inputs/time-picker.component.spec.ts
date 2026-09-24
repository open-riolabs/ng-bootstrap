import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { TimePickerComponent } from './time-picker.component';

const ROME = 'Europe/Rome';
/** Mid-July: Rome is UTC+2, so a naive UTC hour would land two hours out. */
const SUMMER_DAY = DateTz.parse('2026-07-15 00:00', 'YYYY-MM-DD HH:mm', ROME);
/** Mid-January: UTC+1, to prove the offset is read rather than assumed. */
const WINTER_DAY = DateTz.parse('2026-01-15 00:00', 'YYYY-MM-DD HH:mm', ROME);

@Component({
  imports: [TimePickerComponent, FormsModule],
  template: `
    <rlb-time-picker
      [timezone]="zone()"
      [minute-step]="step()"
      [format]="format()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
  `,
})
class TimeHost {
  zone = signal(ROME);
  step = signal(5);
  format = signal('HH:mm');
  value = signal<IDateTz | undefined>(SUMMER_DAY);
}

describe('TimePickerComponent', () => {
  let fixture: ComponentFixture<TimeHost>;
  let host: TimeHost;
  let element: HTMLElement;
  let picker: TimePickerComponent;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const field = () => element.querySelector('input') as HTMLInputElement;
  const local = (value: IDateTz) => new DateTz(value).cloneToTimezone!(ROME);

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TimeHost] });
    fixture = TestBed.createComponent(TimeHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    picker = fixture.debugElement.children[0].componentInstance;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  /**
   * The whole reason this component exists rather than an `<input type="time">`: date-tz's
   * mutators work on the raw UTC timestamp, so `set(9, 'hour')` would land on 09:00 UTC — 11:00
   * in Rome in summer.
   */
  it('sets the local hour, not the UTC one', async () => {
    picker.pick(9, 30);
    await settle();

    const picked = local(host.value()!);
    expect(picked.hour).toBe(9);
    expect(picked.minute).toBe(30);
    expect(picked.toString!('HH:mm')).toBe('09:30');
  });

  it('keeps the day it was given', async () => {
    picker.pick(23, 45);
    await settle();

    const picked = local(host.value()!);
    expect(picked.toString!('YYYY-MM-DD HH:mm')).toBe('2026-07-15 23:45');
  });

  it('reads the offset of the day rather than assuming one', async () => {
    host.value.set(WINTER_DAY);
    await settle();

    picker.pick(9, 0);
    await settle();

    expect(local(host.value()!).toString!('YYYY-MM-DD HH:mm')).toBe('2026-01-15 09:00');
  });

  /** Midnight is where a naive `set` crosses into the wrong day. */
  it('stays on the same day at midnight', async () => {
    picker.pick(0, 0);
    await settle();

    expect(local(host.value()!).toString!('YYYY-MM-DD HH:mm')).toBe('2026-07-15 00:00');
  });

  it('writes the value into the box in the format it was given', async () => {
    picker.pick(14, 5);
    await settle();

    expect(field().value).toBe('14:05');

    host.format.set('hh:mm AA');
    await settle();

    expect(field().value).toBe('02:05 PM');
  });

  it('reads a typed time back', async () => {
    field().value = '07:20';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(local(host.value()!).toString!('HH:mm')).toBe('07:20');
  });

  /** A box that quietly turns nonsense into a time is worse than one that refuses it. */
  it('puts the box back when what was typed is not a time', async () => {
    picker.pick(7, 20);
    await settle();

    field().value = 'half past nine';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(field().value).toBe('07:20');
    expect(local(host.value()!).toString!('HH:mm')).toBe('07:20');
  });

  it('empties the value when the box is cleared', async () => {
    field().value = '';
    field().dispatchEvent(new Event('blur'));
    await settle();

    expect(host.value()).toBeUndefined();
  });

  it('offers the minutes its step asks for', async () => {
    host.step.set(15);
    await settle();

    picker.open();
    await settle();

    const minutes = Array.from(
      document.querySelectorAll('[role="listbox"][aria-label="Minutes"] button'),
    ).map(button => button.textContent!.trim());

    expect(minutes).toEqual(['00', '15', '30', '45']);
    picker.close();
  });
});
