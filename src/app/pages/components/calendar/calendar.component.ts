import { Component, signal } from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { CalendarEvent, CalendarInterval } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar';
import { CalendarLayout } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/interfaces/calendar-layout.interface';
import {
  CalendarChangeEvent,
  CalendarView,
} from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/interfaces/calendar-view.type';
import { getToday } from 'projects/rlb/ng-bootstrap/src/lib/components/calendar/utils/calendar-date-utils';
import { UniqueIdService } from 'projects/rlb/ng-bootstrap/src/lib/shared/unique-id.service';
import { delay, finalize, of, take, tap } from 'rxjs';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class CalendarComponent {
  view: CalendarView = 'week';
  // IANA timezone the calendar renders in. All events are displayed/positioned
  // in this timezone regardless of the timezone they were created with.
  timezone = 'Europe/Rome';
  currentDate: IDateTz = getToday(this.timezone);
  events = signal<CalendarEvent[]>([]);
  loading = signal(false);
  layout: Partial<CalendarLayout> = {};

  // Business hours intervals in seconds from midnight
  // Mon-Fri 09:00-13:00 (32400-46800) and 14:00-18:00 (50400-64800), Sat 09:00-13:00
  intervals: CalendarInterval[] = [
    { dayWeek: 1, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 1, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 2, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 2, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 3, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 3, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 4, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 4, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 5, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 5, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 6, hourStart: 32400, hourStop: 46800, color: 'info' },
  ];

  calendarExample = `<rlb-calendar
  [view]="view"
  [(events)]="events"
  [intervals]="intervals"
  [current-date]="currentDate"
  [timezone]="timezone"
  [loading]="loading()"
  (date-change)="onDateChange($event)"
  (view-change)="onViewChange($event)"
  (event-click)="onEventClick($event)">
</rlb-calendar>`;

  calendarTSSnippet = `import { Component } from '@angular/core';
import { CalendarEvent, CalendarInterval, CalendarView } from '@open-rlb/ng-bootstrap';
import { DateTz, getToday } from '@open-rlb/date-tz';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  view: CalendarView = 'week';
  // IANA timezone the calendar is rendered in. Every event is displayed and
  // positioned in this timezone, whatever timezone it was created with.
  timezone = 'Europe/Rome';
  currentDate = getToday(this.timezone);
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Meeting',
      start: new DateTz(getToday(this.timezone)).set(10, 'hour'),
      end: new DateTz(getToday(this.timezone)).set(11, 'hour'),
      color: 'primary'
    }
  ];

  // Business hours (seconds from midnight): Mon-Fri 09:00-13:00 / 14:00-18:00, Sat 09:00-13:00
  intervals: CalendarInterval[] = [
    { dayWeek: 1, hourStart: 32400, hourStop: 46800, color: 'success' },  // 09:00-13:00
    { dayWeek: 1, hourStart: 50400, hourStop: 64800, color: 'success' },  // 14:00-18:00
    { dayWeek: 2, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 2, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 3, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 3, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 4, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 4, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 5, hourStart: 32400, hourStop: 46800, color: 'success' },
    { dayWeek: 5, hourStart: 50400, hourStop: 64800, color: 'success' },
    { dayWeek: 6, hourStart: 32400, hourStop: 46800, color: 'info' },     // Sat morning only
  ];

  onDateChange(event: CalendarChangeEvent) {
    console.log('Date changed', event);
  }

  onViewChange(event: CalendarChangeEvent) {
    console.log('View changed', event);
  }

  onEventClick(event: CalendarEvent) {
    console.log('Event clicked', event);
  }
}`;

  api: DocApiRow[] = [
    {
      name: 'view',
      type: "'month' | 'week' | 'day'",
      default: "'week'",
      description: "The active calendar view. Supports two-way binding with [(view)].",
      kind: 'Two-way',
    },
    {
      name: 'events',
      type: 'CalendarEvent[]',
      default: '[]',
      description: 'List of events to display. Supports two-way binding with [(events)] so the calendar can update the list internally (create, edit, delete via built-in modals and drag-and-drop).',
      kind: 'Two-way',
    },
    {
      name: 'current-date',
      type: 'IDateTz',
      default: 'getToday()',
      description: 'The date the calendar is currently focused on. Supports two-way binding with [(current-date)].',
      kind: 'Two-way',
    },
    {
      name: 'timezone',
      type: 'string',
      default: 'browser timezone',
      description: "IANA timezone the calendar renders in (e.g. 'Europe/Rome'). Day boundaries, time-slot positions, the now-line and every event are normalized to this timezone regardless of the timezone they were created with.",
      kind: 'Input',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'When true an indeterminate progress bar is shown across the calendar grid.',
      kind: 'Input',
    },
    {
      name: 'show-toolbar',
      type: 'boolean',
      default: 'true',
      description: 'Show or hide the top navigation toolbar (view switcher and date navigation).',
      kind: 'Input',
    },
    {
      name: 'manage-events',
      type: 'boolean',
      default: 'true',
      description: 'Enable built-in event CRUD: create/edit/delete modals, toast notifications and drag-and-drop updates. Set to false to disable all built-in interactions; (event-click) still fires.',
      kind: 'Input',
    },
    {
      name: 'intervals',
      type: 'CalendarInterval[]',
      default: '[]',
      description: 'Background time intervals shown as colored bands in week and day views (e.g. business hours). Each entry specifies dayWeek (0 = Sunday … 6 = Saturday), optional hourStart/hourStop in seconds from midnight (0–86400), an optional Bootstrap color, and an optional label.',
      kind: 'Input',
    },
    {
      name: 'layout',
      type: 'Partial<CalendarLayout>',
      default: '{}',
      description: 'Override the default layout dimensions: rowHeight (px, default 110), maxBodyHeight (rem, default 30), minHeaderHeight (rem, default 3.5).',
      kind: 'Input',
    },
    {
      name: 'date-change',
      type: 'CalendarChangeEvent',
      description: 'Emitted whenever the focused date changes. The payload contains the new date and the current view.',
      kind: 'Output',
    },
    {
      name: 'view-change',
      type: 'CalendarChangeEvent',
      description: 'Emitted whenever the active view changes. The payload contains the current date and the new view.',
      kind: 'Output',
    },
    {
      name: 'event-click',
      type: 'CalendarEvent',
      description: 'Emitted when the user clicks an event chip. Fires even when manage-events is false.',
      kind: 'Output',
    },
    {
      name: 'container-event-click',
      type: 'CalendarEvent[]',
      description: 'Emitted when the user clicks an overflow indicator that groups multiple events. Payload is the list of overflowing events.',
      kind: 'Output',
    },
  ];

  constructor(private unique: UniqueIdService) {}

  onGenerateTestEvents() {
    this.loading.set(true);
    of(this.generateTestEvents())
      .pipe(
        take(1),
        delay(700),
        tap((events: CalendarEvent[]) => this.events.set([...events])),
        finalize(() => this.loading.set(false)),
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

    const now = getToday(this.timezone);

    events.push({
      color: 'primary',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set!(11, 'hour').set!(0, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set!(12, 'hour').set!(30, 'minute'),
    });

    events.push({
      color: 'danger',
      title: 'Today 1h (11:00-12:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(11, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.5h (11:30-12:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(11, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'info',
      title: 'Today 1.5h (11:00-12:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(11, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.75h (11:15-12:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(11, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'secondary',
      title: 'Today 1.75h (10:45-12:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(10, 'hour').set(45, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'danger',
      title: 'Today 0.5h test 2 (11:30-12:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(11, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'success',
      title: 'Today 1.75h test 3 (10:15-12:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(10, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'warning',
      title: 'Today 1.5h test 4 (12:00-13:30)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(12, 'hour').set(0, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(13, 'hour').set(30, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 0.5h test 4 (13:30-14:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(13, 'hour').set(30, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(14, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'danger',
      title: 'Today 45min (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(15, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(16, 'hour').set(0, 'minute'),
    });

    events.push({
      color: 'primary',
      title: 'Today 45min 2 (15:15-16:00)',
      start: new DateTz(now).cloneToTimezone(this.timezone).set(15, 'hour').set(15, 'minute'),
      end: new DateTz(now).cloneToTimezone(this.timezone).set(16, 'hour').set(0, 'minute'),
    });

    // === 2. Event "Tomorrow" (currentDate + 1 day) ===
    const tomorrowBase = new DateTz(now).add(1, 'day');
    events.push({
      color: 'info',
      title: 'Tomorrow 2h (09:00-11:00)',
      start: new DateTz(tomorrowBase).cloneToTimezone(this.timezone).set!(9, 'hour').set!(0, 'minute'),
      end: new DateTz(tomorrowBase).cloneToTimezone(this.timezone).set!(11, 'hour').set!(0, 'minute'),
    });

    // === 3. Event after tomorrow (currentDate + 2 days) ===
    const dayAfterTomorrowBase = new DateTz(now).add(2, 'day');
    events.push({
      color: 'success',
      title: 'After Tomorrow 1h (17:00-18:00)',
      start: new DateTz(dayAfterTomorrowBase).cloneToTimezone(this.timezone).set!(17, 'hour').set!(
        0,
        'minute',
      ),
      end: new DateTz(dayAfterTomorrowBase).cloneToTimezone(this.timezone).set!(18, 'hour').set!(
        0,
        'minute',
      ),
    });

    // === 4. Event (currentDate - 1 day) ===
    const yesterdayBase = new DateTz(now).add(-1, 'day');

    events.push({
      color: 'warning',
      title: 'Yesterday 2h (14:00-16:00)',
      start: new DateTz(yesterdayBase).cloneToTimezone(this.timezone).set!(14, 'hour').set!(0, 'minute'),
      end: new DateTz(yesterdayBase).cloneToTimezone(this.timezone).set!(16, 'hour').set!(0, 'minute'),
    });

    // === 5. Event "Cross day"  ===
    const dayBeforeYesterdayBase = new DateTz(now).add(-2, 'day');
    const dayBeforeYesterdayEndBase = new DateTz(now).add(-1, 'day');
    events.push({
      color: 'secondary',
      title: 'Cross Day (22:00 -> 02:00)',
      start: new DateTz(dayBeforeYesterdayBase).cloneToTimezone(this.timezone).set!(22, 'hour').set!(
        0,
        'minute',
      ).stripSecMillis(),
      end: new DateTz(dayBeforeYesterdayEndBase).cloneToTimezone(this.timezone).set!(2, 'hour').set!(
        0,
        'minute',
      ).stripSecMillis(),
    });

    // === 6. Event authored in a DIFFERENT timezone (UTC) ===
    // Demonstrates that the calendar translates it into its own timezone:
    // 08:00 UTC is shown at the corresponding wall-clock time in `timezone`.
    events.push({
      color: 'dark',
      title: 'Authored 08:00 UTC (shown in calendar tz)',
      start: new DateTz(now).cloneToTimezone('UTC').set(8, 'hour').set(0, 'minute').stripSecMillis(),
      end: new DateTz(now).cloneToTimezone('UTC').set(9, 'hour').set(0, 'minute').stripSecMillis(),
    });

    return events.map(event => {
      return {
        ...event,
        id: this.unique.id,
      };
    });
  }
}
