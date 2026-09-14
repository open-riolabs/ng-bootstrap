import { TestBed } from '@angular/core/testing';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { CalendarView } from '../interfaces/calendar-view.type';
import { addDays } from '../utils/calendar-date-utils';
import { CalendarHeaderComponent } from './calendar-header.component';

const ROMA = 'Europe/Rome';
const at = (wallClock: string, tz = ROMA): IDateTz =>
  DateTz.parse(wallClock, 'YYYY-MM-DD HH:mm', tz);
const ymd = (d: IDateTz, tz = ROMA) => new DateTz(d).cloneToTimezone(tz).toString('YYYY-MM-DD');

function renderHeader(view: CalendarView, currentDate: IDateTz) {
  const fixture = TestBed.createComponent(CalendarHeaderComponent);
  fixture.componentRef.setInput('view', view);
  fixture.componentRef.setInput('currentDate', currentDate);
  fixture.componentRef.setInput('timezone', ROMA);
  const emitted: IDateTz[] = [];
  fixture.componentInstance.dateChange.subscribe(d => emitted.push(d));
  return { header: fixture.componentInstance, emitted };
}

describe('addDays', () => {
  it('restituisce una nuova DateTz e lascia com\'era la data ricevuta', () => {
    const date = at('2026-09-14 10:00');
    const timestamp = date.timestamp;

    const later = addDays(date, 3);
    const earlier = addDays(date, -3);

    expect(date.timestamp).toBe(timestamp);
    expect(date.timezone).toBe(ROMA);
    expect(later).not.toBe(date);
    expect(earlier).not.toBe(date);
    expect(ymd(later)).toBe('2026-09-17');
    expect(ymd(earlier)).toBe('2026-09-11');
    expect(later.timezone).toBe(ROMA);
  });
});

describe('CalendarHeaderComponent - prev e next non toccano currentDate', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [CalendarHeaderComponent] }));

  for (const view of ['week', 'day', 'month'] as CalendarView[]) {
    for (const direction of ['next', 'prev'] as const) {
      it(`${direction} in vista ${view} lascia com'era la data in input`, () => {
        const currentDate = at('2026-09-16 10:00');
        const timestamp = currentDate.timestamp;
        const { header, emitted } = renderHeader(view, currentDate);

        header[direction]();

        expect(currentDate.timestamp).toBe(timestamp);
        expect(header.currentDate()).toBe(currentDate);
        expect(emitted.length).toBe(1);
        expect(emitted[0]).not.toBe(currentDate);
      });
    }
  }

  it('due next di fila senza che il genitore aggiorni la data portano allo stesso giorno', () => {
    const { header, emitted } = renderHeader('week', at('2026-09-16 10:00'));

    header.next();
    header.next();

    expect(emitted.map(d => ymd(d))).toEqual(['2026-09-23', '2026-09-23']);
  });

  it('in vista giorno next e prev si allontanano di un giorno dalla stessa data', () => {
    const { header, emitted } = renderHeader('day', at('2026-09-16 10:00'));

    header.next();
    header.prev();

    expect(emitted.map(d => ymd(d))).toEqual(['2026-09-17', '2026-09-15']);
  });
});
