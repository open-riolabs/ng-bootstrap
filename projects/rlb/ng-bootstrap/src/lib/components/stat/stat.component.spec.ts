import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTz } from '@open-rlb/date-tz';
import { TimelineComponent } from '../timeline/timeline.component';
import { TimelineItemComponent } from '../timeline/timeline-item.component';
import { StatComponent } from './stat.component';

const ROME = 'Europe/Rome';
const at = (text: string) => DateTz.parse(text, 'YYYY-MM-DD HH:mm', ROME);

@Component({
  imports: [StatComponent],
  template: `
    <rlb-stat
      label="Revenue"
      [value]="value()"
      [delta]="delta()"
      [invert-delta]="invert()"
      [sparkline]="spark()"
    />
  `,
})
class StatHost {
  value = signal<string | number>('12.480 €');
  delta = signal<number | undefined>(12);
  invert = signal(false);
  spark = signal<number[]>([]);
}

describe('StatComponent', () => {
  let fixture: ComponentFixture<StatHost>;
  let host: StatHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const deltaEl = () => element.querySelector('.fw-semibold.d-inline-flex') as HTMLElement | null;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [StatHost] });
    fixture = TestBed.createComponent(StatHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  /** A component cannot know whether 1234.5 is money, a count or a percentage, nor in which locale. */
  it('prints the value exactly as it was given', async () => {
    expect(element.textContent).toContain('12.480 €');
  });

  it('writes a rise with its sign and a green', async () => {
    expect(deltaEl()!.textContent).toContain('+12%');
    expect(deltaEl()!.className).toContain('text-success');
  });

  it('writes a fall in red', async () => {
    host.delta.set(-4);
    await settle();

    expect(deltaEl()!.textContent).toContain('-4%');
    expect(deltaEl()!.className).toContain('text-danger');
  });

  /** Churn, latency, cost: the arrow still says what happened, the colour says whether it is good. */
  it('swaps which direction is good when told to', async () => {
    host.delta.set(-4);
    host.invert.set(true);
    await settle();

    expect(deltaEl()!.className).toContain('text-success');
    expect(deltaEl()!.querySelector('i')!.className).toContain('arrow-down');
  });

  it('never leaves the direction to colour alone', async () => {
    // An arrow beside the number, and a sign in the text: two more ways to read it.
    expect(deltaEl()!.querySelector('i')).not.toBeNull();
    expect(deltaEl()!.textContent!.trim().startsWith('+')).toBe(true);
  });

  it('says nothing about a change it was not given', async () => {
    host.delta.set(undefined);
    await settle();

    expect(deltaEl()).toBeNull();
  });

  it('draws a sparkline only once there are two points to join', async () => {
    expect(element.querySelector('polyline')).toBeNull();

    host.spark.set([3]);
    await settle();
    expect(element.querySelector('polyline')).toBeNull();

    host.spark.set([1, 5, 2, 8]);
    await settle();
    const points = element.querySelector('polyline')!.getAttribute('points')!;
    expect(points.split(' ').length).toBe(4);
  });

  /** A flat series would divide by zero; it is drawn down the middle instead of vanishing. */
  it('survives a series that never moves', async () => {
    host.spark.set([7, 7, 7]);
    await settle();

    const points = element.querySelector('polyline')!.getAttribute('points')!;
    expect(points).toBe('0.00,15.00 50.00,15.00 100.00,15.00');
  });
});

@Component({
  imports: [TimelineComponent, TimelineItemComponent],
  template: `
    <rlb-timeline
      group-by-day
      [timezone]="zone"
      time-format="HH:mm"
      day-format="DD/MM/yyyy"
    >
      <rlb-timeline-item [time]="first" heading="Created">one</rlb-timeline-item>
      <rlb-timeline-item [time]="second" heading="Edited">two</rlb-timeline-item>
      <rlb-timeline-item [time]="third" heading="Archived">three</rlb-timeline-item>
      <rlb-timeline-item time="a while ago" heading="Unknown">four</rlb-timeline-item>
    </rlb-timeline>
  `,
})
class TimelineHost {
  zone = ROME;
  first = at('2026-03-15 09:30');
  second = at('2026-03-15 17:05');
  /** 00:30 in Rome is still the previous day in UTC — the case tz-naive day maths gets wrong. */
  third = at('2026-03-16 00:30');
}

describe('TimelineComponent', () => {
  let fixture: ComponentFixture<TimelineHost>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TimelineHost] });
    fixture = TestBed.createComponent(TimelineHost);
    element = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  const headings = () =>
    Array.from(element.querySelectorAll('.rlb-timeline-day')).map(d => d.textContent!.trim());

  it('heads each day once, and groups by the local day rather than the UTC one', () => {
    // 09:30 and 17:05 share a heading; 00:30 the next morning starts a new one even though it is
    // still 15 March in UTC.
    expect(headings()).toEqual(['15/03/2026', '16/03/2026']);
  });

  it('writes each time in the timeline format', () => {
    const times = Array.from(element.querySelectorAll('time')).map(t => t.textContent!.trim());
    expect(times).toEqual(['09:30', '17:05', '00:30']);
  });

  /** `<time>` without a machine-readable datetime is not a time element at all. */
  it('does not dress free text up as a time element', () => {
    const times = Array.from(element.querySelectorAll('time')).map(t => t.textContent!.trim());
    expect(times).not.toContain('a while ago');
  });

  it('gives the machine-readable time without going through a native Date', () => {
    const iso = element.querySelector('time')!.getAttribute('datetime');
    expect(iso).toBe('2026-03-15T09:30:00');
  });

  it('prints a plain string as given and leaves it out of the grouping', () => {
    expect(element.textContent).toContain('a while ago');
    expect(headings().length).toBe(2);
  });
});
