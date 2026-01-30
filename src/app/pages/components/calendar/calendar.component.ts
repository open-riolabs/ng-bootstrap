import { Component } from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { CalendarEvent } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar';
import { CalendarLayout } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/interfaces/calendar-layout.interface';
import {
  CalendarChangeEvent,
  CalendarView,
} from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/interfaces/calendar-view.type';
import { getToday } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/utils/calendar-date-utils';
import { UniqueIdService } from 'projects/rlb/ng-bootstrap/src/lib/shared/unique-id.service';
import { delay, finalize, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: `calendar.component.html`,
  styleUrls: ['calendar.component.scss'],
  standalone: false,
})
export class CalendarComponent {
  view: CalendarView = 'week';
  currentDate: IDateTz = getToday();
  events: CalendarEvent[] = [];
  layout: Partial<CalendarLayout> = {};

  calendarHTMLSnippet = `
<rlb-calendar
  [view]="view"
  [events]="events"
  [current-date]="currentDate"
  (date-change)="onDateChange($event)"
  (view-change)="onViewChange($event)"
  (event-click)="onEventClick($event)">
</rlb-calendar>
`;

  calendarTSSnippet = `
import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from '@open-rlb/ng-bootstrap';
import { DateTz, getToday } from '@open-rlb/date-tz';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  view: CalendarView = 'week';
  currentDate = getToday();
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Meeting',
      start: new DateTz(getToday()).set(10, 'hour'),
      end: new DateTz(getToday()).set(11, 'hour'),
      color: 'primary'
    }
  ];

  onDateChange(event: any) {
    console.log('Date changed', event);
  }

  onViewChange(event: any) {
    console.log('View changed', event);
  }

  onEventClick(event: any) {
    console.log('Event clicked', event);
  }
}
`;

  loading: boolean = false;

  constructor(private unique: UniqueIdService) {}

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code);
  }

  onGenerateTestEvents() {
    this.loading = true;
    of(this.generateTestEvents())
      .pipe(
        take(1),
        delay(700),
        tap((events: CalendarEvent[]) => (this.events = events)),
        finalize(() => (this.loading = false)),
      )
      .subscribe();
  }

  onEventClick(event: CalendarEvent) {
    console.log('event clicked', event);
  }

  onDateChange(changeEvent: CalendarChangeEvent) {
    console.log('date change', changeEvent);
  }

  onViewChange(changeEvent: CalendarChangeEvent) {
    console.log('view change', changeEvent);
  }

  private generateTestEvents(): CalendarEvent[] {
    const events: any[] = [];

    const now = getToday();

    events.push({
      color: 'primary',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).convertToTimezone('UTC').set!(11, 'hour').set!(
        0,
        'minute',
      ),
      end: new DateTz(now).convertToTimezone('UTC').set!(12, 'hour').set!(
        30,
        'minute',
      ),
    });

    events.push({
      color: 'danger',
      title: 'Today 1h (11:00-12:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(11, 'hour')
        .set(0, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.5h (11:30-12:30)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(11, 'hour')
        .set(30, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(30, 'minute'),
    });

    events.push({
      color: 'info',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(11, 'hour')
        .set(0, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(30, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.75h (11:15-12:30)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(11, 'hour')
        .set(15, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(30, 'minute'),
    });

    events.push({
      color: 'secondary',
      title: 'Today 1.75h (10:45-12:30)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(10, 'hour')
        .set(45, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(30, 'minute'),
    });

    events.push({
      color: 'danger',
      title: 'Today 0.5h test 2 (11:30-12:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(11, 'hour')
        .set(30, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.75h test 3 (10:15-12:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(10, 'hour')
        .set(15, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(0, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.5h test 4 (12:00-13:30)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(12, 'hour')
        .set(0, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(13, 'hour')
        .set(30, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 0.5h test 4 (13:30-14:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(13, 'hour')
        .set(30, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(14, 'hour')
        .set(0, 'minute'),
    });

    // Today from 15:15 to 16:00

    events.push({
      color: 'danger',
      title: 'Today 45min (15:15-16:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(15, 'hour')
        .set(15, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(16, 'hour')
        .set(0, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 45min 2 (15:15-16:00)',
      start: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(15, 'hour')
        .set(15, 'minute'),
      end: new DateTz(now)
        .cloneToTimezone('UTC')
        .set(16, 'hour')
        .set(0, 'minute'),
    });

    // === 2. Event "Tomorrow" (currentDate + 1 day) ===
    const tomorrowBase = new DateTz(now).add(1, 'day');
    events.push({
      color: 'info',
      title: 'Tomorrow 2h (09:00-11:00)',
      start: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(9, 'hour')
        .set!(0, 'minute'),
      end: new DateTz(tomorrowBase).convertToTimezone('UTC').set!(11, 'hour')
        .set!(0, 'minute'),
    });

    // === 3. Event after tomorrow (currentDate + 2 days) ===
    const dayAfterTomorrowBase = new DateTz(now).add(2, 'day');
    events.push({
      color: 'success',
      title: 'After Tomorrow 1h (17:00-18:00)',
      start: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(
        17,
        'hour',
      ).set!(0, 'minute'),
      end: new DateTz(dayAfterTomorrowBase).convertToTimezone('UTC').set!(
        18,
        'hour',
      ).set!(0, 'minute'),
    });

    // === 4. Event (currentDate - 1 day) ===
    const yesterdayBase = new DateTz(now).add(-1, 'day');

    events.push({
      color: 'warning',
      title: 'Yesterday 2h (14:00-16:00)',
      start: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(14, 'hour')
        .set!(0, 'minute'),
      end: new DateTz(yesterdayBase).convertToTimezone('UTC').set!(16, 'hour')
        .set!(0, 'minute'),
    });

    // === 5. Event "Cross day"  ===
    const dayBeforeYesterdayBase = new DateTz(now).add(-2, 'day');
    const dayBeforeYesterdayEndBase = new DateTz(now).add(-1, 'day');
    events.push({
      color: 'secondary',
      title: 'Cross Day (22:00 -> 02:00)',
      start: new DateTz(dayBeforeYesterdayBase).convertToTimezone('UTC').set!(
        22,
        'hour',
      ).set!(0, 'minute').stripSecMillis(),
      end: new DateTz(dayBeforeYesterdayEndBase).convertToTimezone('UTC').set!(
        2,
        'hour',
      ).set!(0, 'minute').stripSecMillis(),
    });

    return events.map((event) => {
      return {
        ...event,
        id: this.unique.id,
      };
    });
  }
}
