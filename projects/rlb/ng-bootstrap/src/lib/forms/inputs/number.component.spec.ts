import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NumberComponent } from './number.component';

@Component({
  imports: [NumberComponent, FormsModule],
  template: `
    <rlb-number
      [locale]="locale()"
      [currency]="currency()"
      [decimals]="decimals()"
      [min]="min()"
      [max]="max()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
  `,
})
class NumberHost {
  locale = signal('en-GB');
  currency = signal<string | undefined>(undefined);
  decimals = signal<number | undefined>(undefined);
  min = signal<number | undefined>(undefined);
  max = signal<number | undefined>(undefined);
  value = signal<number | null>(1234.5);
}

describe('NumberComponent', () => {
  let fixture: ComponentFixture<NumberHost>;
  let host: NumberHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const field = () => element.querySelector('input') as HTMLInputElement;

  const typeInto = async (text: string) => {
    field().dispatchEvent(new Event('focus'));
    await settle();
    field().value = text;
    field().dispatchEvent(new Event('input'));
    await settle();
  };

  const leave = async () => {
    field().dispatchEvent(new Event('blur'));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [NumberHost] });
    fixture = TestBed.createComponent(NumberHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('shows the number grouped for its locale', async () => {
    host.value.set(1234567.5);
    await settle();

    expect(field().value).toBe('1,234,567.5');

    host.locale.set('it-IT');
    await settle();

    expect(field().value).toBe('1.234.567,5');
  });

  /** Italian groups from five digits up, so a four-digit number is written without a separator. */
  it('leaves the grouping to the locale rather than imposing one', async () => {
    host.locale.set('it-IT');
    await settle();

    expect(field().value).toBe('1234,5');
  });

  it('writes money with the symbol its locale puts it on', async () => {
    host.currency.set('EUR');
    host.locale.set('it-IT');
    await settle();

    // Non-breaking space between the number and the symbol, as Intl writes it.
    expect(field().value.replace(/\u00a0/g, ' ')).toBe('1234,50 €');

    host.locale.set('en-GB');
    await settle();

    expect(field().value.replace(/\u00a0/g, ' ')).toBe('€1,234.50');
  });

  /** Grouping marks inserted under the caret move it, which makes typing an amount a fight. */
  it('hands back a plain number while the field is being typed into', async () => {
    field().dispatchEvent(new Event('focus'));
    await settle();

    expect(field().value).toBe('1234.5');
  });

  it('reads back what was typed in the locale it was typed in', async () => {
    host.locale.set('it-IT');
    await settle();

    await typeInto('9.876,25');

    expect(host.value()).toBe(9876.25);
  });

  it('binds a number, never the formatted string', async () => {
    await typeInto('42');

    expect(host.value()).toBe(42);
    expect(typeof host.value()).toBe('number');
  });

  it('empties to null rather than to zero', async () => {
    await typeInto('');
    await leave();

    expect(host.value()).toBeNull();
    expect(field().value).toBe('');
  });

  /** Clamping mid-keystroke is how typing 10 into a field with a minimum of 5 becomes 5. */
  it('applies the bounds when the field is left, not while it is being typed in', async () => {
    host.min.set(5);
    host.max.set(10);
    await settle();

    await typeInto('1');
    expect(host.value()).toBe(1);

    await leave();
    expect(host.value()).toBe(5);

    await typeInto('99');
    expect(host.value()).toBe(99);

    await leave();
    expect(host.value()).toBe(10);
  });

  it('formats again once the field is left', async () => {
    await typeInto('9876.5');
    await leave();

    expect(field().value).toBe('9,876.5');
  });

  it('keeps the digits it was told to keep', async () => {
    host.decimals.set(2);
    host.value.set(3);
    await settle();

    expect(field().value).toBe('3.00');
  });
});
