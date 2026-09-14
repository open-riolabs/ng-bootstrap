import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { vi } from 'vitest';
import { CalendarHeaderComponent } from '../../header/calendar-header.component';
import { CalendarEvent } from '../../interfaces/calendar-event.interface';
import { DEFAULT_CALENDAR_LAYOUT } from '../../interfaces/calendar-layout.interface';
import { CalendarView } from '../../interfaces/calendar-view.type';
import { CalendarMonthGridComponent } from '../month/calendar-month-grid.component';
import { CalendarWeekGridComponent } from './calendar-week-grid.component';

const ROMA = 'Europe/Rome';
const at = (wallClock: string, tz = ROMA): IDateTz =>
  DateTz.parse(wallClock, 'YYYY-MM-DD HH:mm', tz);
const ymd = (d: IDateTz, tz = ROMA) => new DateTz(d).cloneToTimezone(tz).toString('YYYY-MM-DD');
const giorni = (from: string, to: string) => {
  const out: string[] = [];
  for (let d = at(`${from} 12:00`); ymd(d) <= to; d = new DateTz(d.timestamp + 86_400_000, ROMA)) {
    out.push(ymd(d));
  }
  return out;
};

function renderWeek(currentDate: IDateTz, timezone = ROMA, events: CalendarEvent[] = []) {
  const fixture = TestBed.createComponent(CalendarWeekGridComponent);
  fixture.componentRef.setInput('view', 'week' as CalendarView);
  fixture.componentRef.setInput('currentDate', currentDate);
  fixture.componentRef.setInput('timezone', timezone);
  fixture.componentRef.setInput('layout', DEFAULT_CALENDAR_LAYOUT);
  fixture.componentRef.setInput('events', events);
  fixture.detectChanges();
  return fixture;
}

const weekOf = (currentDate: IDateTz, timezone = ROMA) =>
  renderWeek(currentDate, timezone).componentInstance.days().map(d => ymd(d, timezone));

describe('CalendarWeekGridComponent - la settimana della domenica', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [CalendarWeekGridComponent] }));

  it('di domenica mostra la settimana che finisce quel giorno', () => {
    // 2026-09-13 è domenica.
    expect(weekOf(at('2026-09-13 10:00'))).toEqual(giorni('2026-09-07', '2026-09-13'));
    expect(weekOf(at('2026-09-13 00:00'))).toEqual(giorni('2026-09-07', '2026-09-13'));
    expect(weekOf(at('2026-09-13 23:59'))).toEqual(giorni('2026-09-07', '2026-09-13'));
  });

  it('ogni giorno, domenica compresa, mostra la settimana lun-dom che lo contiene', () => {
    for (const giorno of giorni('2026-09-14', '2026-09-20')) {
      expect(weekOf(at(`${giorno} 09:00`))).toEqual(giorni('2026-09-14', '2026-09-20'));
    }
  });

  it('la domenica si decide nel timezone del calendario, non in quello della data', () => {
    // Domenica 20:00 a Roma è già lunedì 03:00 a Tokyo.
    const domenicaSera = at('2026-09-13 20:00');
    expect(weekOf(domenicaSera, ROMA)).toEqual(giorni('2026-09-07', '2026-09-13'));
    expect(weekOf(domenicaSera, 'Asia/Tokyo')).toEqual(giorni('2026-09-14', '2026-09-20'));
    // Domenica 23:30 UTC è lunedì 01:30 a Roma.
    expect(weekOf(at('2026-09-13 23:30', 'UTC'), ROMA)).toEqual(giorni('2026-09-14', '2026-09-20'));
  });

  it('la domenica del cambio d\'ora chiude la sua settimana, con i giorni a mezzanotte locale', () => {
    // 2026-10-25: fine dell'ora legale a Roma.
    const fixture = renderWeek(at('2026-10-25 12:00'));
    const days = fixture.componentInstance.days();
    expect(days.map(d => ymd(d))).toEqual(giorni('2026-10-19', '2026-10-25'));
    expect(days.every(d => new DateTz(d).cloneToTimezone(ROMA).toString('HH:mm') === '00:00')).toBe(true);
  });

  it('di domenica gli eventi di oggi stanno nella griglia', () => {
    const oggi: CalendarEvent = { id: 'oggi', title: 'Oggi', start: at('2026-09-13 10:00'), end: at('2026-09-13 11:00') };
    const fixture = renderWeek(at('2026-09-13 08:00'), ROMA, [oggi]);

    const domenica = fixture.componentInstance.days()[6];
    expect(ymd(domenica)).toBe('2026-09-13');
    expect(fixture.componentInstance.getEventsForDay(domenica).map(e => e.id)).toEqual(['oggi']);
    expect(fixture.debugElement.queryAll(By.css('rlb-calendar-event')).length).toBe(1);
  });
});

describe('CalendarMonthGridComponent - le righe della vista mese sono lun-dom', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [CalendarMonthGridComponent] }));

  function monthOf(currentDate: IDateTz) {
    const fixture = TestBed.createComponent(CalendarMonthGridComponent);
    fixture.componentRef.setInput('view', 'month' as CalendarView);
    fixture.componentRef.setInput('currentDate', currentDate);
    fixture.componentRef.setInput('timezone', ROMA);
    fixture.componentRef.setInput('layout', DEFAULT_CALENDAR_LAYOUT);
    fixture.detectChanges();
    return fixture.componentInstance.weeks().map(week => week.map(slot => ymd(slot.date)));
  }

  it('di domenica la riga che la contiene è la stessa settimana della vista settimana', () => {
    const weeks = monthOf(at('2026-09-13 10:00'));
    expect(weeks[0][0]).toBe('2026-08-31');
    expect(weeks.find(w => w.includes('2026-09-13'))).toEqual(giorni('2026-09-07', '2026-09-13'));
  });

  it('un mese che inizia di domenica parte dal lunedì prima', () => {
    // 2026-11-01 è domenica.
    const weeks = monthOf(at('2026-11-15 10:00'));
    expect(weeks[0]).toEqual(giorni('2026-10-26', '2026-11-01'));
    expect(weeks.length).toBe(6);
  });
});

describe('CalendarHeaderComponent - navigazione della settimana dalla domenica', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [CalendarHeaderComponent, CalendarWeekGridComponent] }),
  );

  function navigate(from: IDateTz, direction: 'next' | 'prev'): IDateTz {
    const fixture = TestBed.createComponent(CalendarHeaderComponent);
    fixture.componentRef.setInput('view', 'week' as CalendarView);
    fixture.componentRef.setInput('currentDate', from);
    fixture.componentRef.setInput('timezone', ROMA);
    let emitted: IDateTz | undefined;
    fixture.componentInstance.dateChange.subscribe(d => (emitted = d));
    fixture.componentInstance[direction]();
    expect(emitted).toBeTruthy();
    return emitted!;
  }

  it('avanti e indietro da una domenica portano alla settimana dopo e a quella prima', () => {
    // Una data nuova per ogni chiamata: addDays sposta anche l'istanza che riceve.
    expect(weekOf(navigate(at('2026-09-13 10:00'), 'next'))).toEqual(giorni('2026-09-14', '2026-09-20'));
    expect(weekOf(navigate(at('2026-09-13 10:00'), 'prev'))).toEqual(giorni('2026-08-31', '2026-09-06'));
  });

  it('attraverso il cambio d\'ora una settimana resta una settimana', () => {
    // Domenica 25/10 a mezzanotte + 7 giorni UTC-naive è sabato 31/10 alle 23:00.
    expect(weekOf(navigate(at('2026-10-25 00:00'), 'next'))).toEqual(giorni('2026-10-26', '2026-11-01'));
    expect(weekOf(navigate(at('2026-11-01 00:00'), 'prev'))).toEqual(giorni('2026-10-19', '2026-10-25'));
    // 2026-03-29: inizio dell'ora legale.
    expect(weekOf(navigate(at('2026-04-05 00:00'), 'prev'))).toEqual(giorni('2026-03-23', '2026-03-29'));
  });

  it('«Today» di domenica resta sulla settimana che finisce oggi', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(at('2026-09-13 10:00').timestamp);
    try {
      const fixture = TestBed.createComponent(CalendarHeaderComponent);
      fixture.componentRef.setInput('view', 'week' as CalendarView);
      fixture.componentRef.setInput('currentDate', at('2026-09-01 10:00'));
      fixture.componentRef.setInput('timezone', ROMA);
      let emitted: IDateTz | undefined;
      fixture.componentInstance.dateChange.subscribe(d => (emitted = d));
      fixture.componentInstance.today();

      expect(ymd(emitted!)).toBe('2026-09-13');
      expect(weekOf(emitted!)).toEqual(giorni('2026-09-07', '2026-09-13'));
    } finally {
      vi.useRealTimers();
    }
  });
});
