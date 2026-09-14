import { CdkDrag } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ModalService } from '../modals/modal.service';
import { ToastService } from '../toast';
import { CalendarOverflowEventsContainerComponent } from './calendar-dialogs';
import { CalendarComponent } from './calendar.component';
import { CalendarEvent } from './interfaces/calendar-event.interface';
import { CalendarView } from './interfaces/calendar-view.type';

const ROMA = 'Europe/Rome';
const at = (wallClock: string): IDateTz => DateTz.parse(wallClock, 'YYYY-MM-DD HH:mm', ROMA);

// Mercoledì 16/09/2026: la settimana lun 14 - dom 20 contiene entrambi gli eventi.
const lezione: CalendarEvent = {
  id: 'lezione',
  title: 'Lezione',
  start: at('2026-09-16 10:00'),
  end: at('2026-09-16 11:00'),
  readonly: true,
};
const appuntamento: CalendarEvent = {
  id: 'appuntamento',
  title: 'Appuntamento',
  start: at('2026-09-16 14:00'),
  end: at('2026-09-16 15:00'),
};

describe('CalendarComponent - eventi readonly', () => {
  let fixture: ComponentFixture<CalendarComponent>;
  let component: CalendarComponent;
  let modals: { openModal: ReturnType<typeof vi.fn>; openConfirmModal: ReturnType<typeof vi.fn> };
  let toasts: { openToast: ReturnType<typeof vi.fn> };

  function render(view: CalendarView, manageEvents = true) {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('view', view);
    fixture.componentRef.setInput('timezone', ROMA);
    fixture.componentRef.setInput('current-date', at('2026-09-16 09:00'));
    fixture.componentRef.setInput('events', [lezione, appuntamento]);
    fixture.componentRef.setInput('show-toolbar', false);
    fixture.componentRef.setInput('manage-events', manageEvents);
    fixture.detectChanges();
  }

  function clickEvent(id: string | number) {
    const chip = fixture.debugElement
      .queryAll(By.css('rlb-calendar-event'))
      .find(de => de.componentInstance.event().id === id);
    expect(chip).toBeTruthy();
    (chip!.nativeElement.querySelector('.calendar-event') as HTMLElement).click();
  }

  function dragOf(id: string | number): CdkDrag {
    const de = fixture.debugElement
      .queryAll(By.directive(CdkDrag))
      .find(d => d.injector.get(CdkDrag).data.id === id);
    expect(de).toBeTruthy();
    return de!.injector.get(CdkDrag);
  }

  beforeEach(() => {
    modals = {
      openModal: vi.fn(() => of({ reason: 'close', result: undefined })),
      openConfirmModal: vi.fn(() => of({ reason: 'ok', result: undefined })),
    };
    toasts = { openToast: vi.fn(() => of(null)) };
    TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: ModalService, useValue: modals },
        { provide: ToastService, useValue: toasts },
      ],
    });
  });

  it('il click su un evento readonly emette event-click e non apre il modal', () => {
    render('week');
    const clicked: CalendarEvent[] = [];
    component.eventClick.subscribe(e => clicked.push(e));

    clickEvent('lezione');

    expect(clicked.map(e => e.id)).toEqual(['lezione']);
    expect(modals.openModal).not.toHaveBeenCalled();
  });

  it('il click su un evento normale apre ancora rlb-calendar-event-create-edit', () => {
    render('week');
    const clicked: CalendarEvent[] = [];
    component.eventClick.subscribe(e => clicked.push(e));

    clickEvent('appuntamento');

    expect(clicked.map(e => e.id)).toEqual(['appuntamento']);
    expect(modals.openModal).toHaveBeenCalledTimes(1);
    expect(modals.openModal.mock.calls[0][0]).toBe('rlb-calendar-event-create-edit');
  });

  it('il «Cancel» elimina solo gli eventi che il modal può aprire', () => {
    modals.openModal.mockReturnValue(of({ reason: 'cancel', result: undefined }));
    render('week');

    component.onEventClick(lezione);
    expect(component.events().map(e => e.id)).toEqual(['lezione', 'appuntamento']);

    component.onEventClick(appuntamento);
    expect(component.events().map(e => e.id)).toEqual(['lezione']);
  });

  it('con manage-events spento event-click esce anche per un evento readonly', () => {
    render('week', false);
    const clicked: CalendarEvent[] = [];
    component.eventClick.subscribe(e => clicked.push(e));

    clickEvent('lezione');

    expect(clicked.map(e => e.id)).toEqual(['lezione']);
    expect(modals.openModal).not.toHaveBeenCalled();
  });

  for (const view of ['week', 'day', 'month'] as CalendarView[]) {
    it(`nella vista ${view} un evento readonly non si trascina, gli altri sì`, () => {
      render(view);
      expect(dragOf('lezione').disabled).toBe(true);
      expect(dragOf('appuntamento').disabled).toBe(false);
    });
  }

  it('un event-change su un evento readonly non tocca gli eventi', () => {
    render('week');
    component.onEventChange({ ...lezione, start: at('2026-09-17 10:00'), end: at('2026-09-17 11:00') });

    expect(component.events()[0]).toBe(lezione);
    expect(toasts.openToast).not.toHaveBeenCalled();
  });

  it('dal modal degli eventi in overflow un evento readonly non si elimina né si modifica', () => {
    render('week');
    for (const action of ['delete', 'edit'] as const) {
      modals.openModal.mockReset();
      modals.openModal.mockReturnValue(of({ reason: 'ok', result: { action, event: lezione } }));

      component.onEventContainerClick([lezione, appuntamento]);

      expect(modals.openModal).toHaveBeenCalledTimes(1);
      expect(modals.openModal.mock.calls[0][0]).toBe('rlb-calendar-overlow-events-container');
    }
    expect(modals.openConfirmModal).not.toHaveBeenCalled();
    expect(component.events().map(e => e.id)).toEqual(['lezione', 'appuntamento']);
  });
});

describe('CalendarOverflowEventsContainerComponent - eventi readonly', () => {
  it('non mostra modifica ed elimina per un evento readonly', () => {
    TestBed.overrideComponent(CalendarOverflowEventsContainerComponent, {
      set: { hostDirectives: [] },
    });
    const fixture = TestBed.createComponent(CalendarOverflowEventsContainerComponent);
    fixture.componentRef.setInput('data', { title: 'Overflow', content: [lezione, appuntamento] });
    fixture.detectChanges();

    const rows = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.modal-body .d-flex.align-items-center'),
    );
    expect(rows.length).toBe(2);
    expect(rows[0].querySelectorAll('button').length).toBe(0);
    expect(rows[1].querySelectorAll('button').length).toBe(2);
  });
});
