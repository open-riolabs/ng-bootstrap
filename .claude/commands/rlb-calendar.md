# RLB ng-Bootstrap Calendar Skill

You are an expert in the **@open-rlb/ng-bootstrap** calendar component (`rlb-calendar`). It provides week, month, and day views with event management, drag-and-drop, and timezone-aware date handling via `@open-rlb/date-tz`.

## Core Types

```typescript
import { IDateTz, DateTz } from '@open-rlb/date-tz';

type CalendarView = 'week' | 'month' | 'day';

interface CalendarEvent {
  id: string;
  title: string;
  start: IDateTz;
  end?: IDateTz;
  color?: Color;          // 'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'
  description?: string;
  [key: string]: any;     // extend freely with custom fields
}

interface CalendarChangeEvent {
  date: IDateTz;
  view: CalendarView;
}

interface CalendarLayout {
  // Partial layout customization options
}
```

---

## Component API

```html
<rlb-calendar
  [(view)]="calendarView"
  [(events)]="calendarEvents"
  [(current-date)]="currentDate"
  [loading]="isLoading"
  [show-toolbar]="true"
  [layout]="layoutOptions"
  (date-change)="onDateChange($event)"
  (view-change)="onViewChange($event)"
  (event-click)="onEventClick($event)"
></rlb-calendar>
```

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `view` | `CalendarView` (model) | `'month'` | Active view — two-way bindable |
| `events` | `CalendarEvent[]` (model) | `[]` | Events array — two-way bindable |
| `current-date` | `IDateTz` (model) | today | Displayed date — two-way bindable |
| `loading` | `boolean` | `false` | Show loading overlay |
| `show-toolbar` | `boolean` | `true` | Show navigation toolbar |
| `layout` | `Partial<CalendarLayout>` | — | Layout customization |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `date-change` | `CalendarChangeEvent` | Fired when user navigates dates |
| `view-change` | `CalendarChangeEvent` | Fired when view mode changes |
| `event-click` | `CalendarEvent` | Fired when user clicks an event |

---

## Basic Usage

```typescript
import { Component, signal } from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { CalendarEvent, CalendarView, CalendarChangeEvent } from '@open-rlb/ng-bootstrap';

@Component({
  template: `
    <rlb-calendar
      [(view)]="view"
      [(events)]="events"
      [(current-date)]="currentDate"
      [loading]="loading()"
      (date-change)="onDateChange($event)"
      (event-click)="onEventClick($event)"
    ></rlb-calendar>
  `
})
export class MyCalendarComponent {
  view: CalendarView = 'month';
  currentDate: IDateTz = new DateTz(); // today
  loading = signal(false);

  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new DateTz('2026-05-14T09:00:00', 'Europe/Rome'),
      end:   new DateTz('2026-05-14T10:00:00', 'Europe/Rome'),
      color: 'primary',
      description: 'Weekly sync'
    },
    {
      id: '2',
      title: 'Deadline',
      start: new DateTz('2026-05-20T00:00:00', 'Europe/Rome'),
      color: 'danger'
    }
  ];

  onDateChange(event: CalendarChangeEvent) {
    // Load events for the new visible date range
    this.loadEvents(event.date, event.view);
  }

  onEventClick(event: CalendarEvent) {
    console.log('Clicked:', event);
  }

  private loadEvents(date: IDateTz, view: CalendarView) {
    this.loading.set(true);
    this.eventService.getEvents(date, view).subscribe(events => {
      this.events = events;
      this.loading.set(false);
    });
  }
}
```

---

## Working with DateTz

The calendar uses `@open-rlb/date-tz` for timezone-aware dates:

```typescript
import { DateTz, IDateTz } from '@open-rlb/date-tz';

// Create dates
const now = new DateTz();                                    // current time in UTC
const rome = new DateTz('2026-05-14T09:00:00', 'Europe/Rome');
const utc  = new DateTz('2026-05-14T09:00:00Z');

// Key methods
rome.toISO();           // ISO string
rome.toDate();          // native Date
rome.format('HH:mm');   // formatted string
rome.startOf('month');  // start of month
rome.endOf('week');     // end of week
rome.add(1, 'day');     // date arithmetic
rome.isBefore(utc);     // comparison
```

---

## Loading Events on Navigation

```typescript
onDateChange(event: CalendarChangeEvent) {
  const { date, view } = event;
  let rangeStart: IDateTz;
  let rangeEnd: IDateTz;

  switch (view) {
    case 'month':
      rangeStart = date.startOf('month');
      rangeEnd   = date.endOf('month');
      break;
    case 'week':
      rangeStart = date.startOf('week');
      rangeEnd   = date.endOf('week');
      break;
    case 'day':
      rangeStart = date.startOf('day');
      rangeEnd   = date.endOf('day');
      break;
  }

  this.eventService.getRange(rangeStart.toISO(), rangeEnd.toISO())
    .subscribe(events => this.events = events);
}
```

---

## CRUD Event Pattern

```typescript
// Handle event click → open edit modal
onEventClick(event: CalendarEvent) {
  this.modal.openModal('event-edit', { data: event }, { size: 'md' })
    .subscribe(result => {
      if (result.reason === 'ok') {
        this.events = this.events.map(e =>
          e.id === result.data.id ? result.data : e
        );
      } else if (result.reason === 'cancel') {
        // delete
        this.events = this.events.filter(e => e.id !== event.id);
      }
    });
}

// Add new event
addEvent(title: string, start: IDateTz, end: IDateTz) {
  const newEvent: CalendarEvent = {
    id: crypto.randomUUID(),
    title,
    start,
    end,
    color: 'primary'
  };
  this.events = [...this.events, newEvent];
}

// Update event (after drag-drop)
updateEvent(updated: CalendarEvent) {
  this.events = this.events.map(e =>
    e.id === updated.id ? updated : e
  );
}

// Remove event
removeEvent(id: string) {
  this.events = this.events.filter(e => e.id !== id);
}
```

---

## CalendarEvent Color Mapping

Use `color` to visually categorize events:

```typescript
const colorMap: Record<string, Color> = {
  meeting:   'primary',
  deadline:  'danger',
  holiday:   'success',
  reminder:  'warning',
  training:  'info',
  other:     'secondary'
};

function mapEvent(raw: ApiEvent): CalendarEvent {
  return {
    id:    raw.id.toString(),
    title: raw.subject,
    start: new DateTz(raw.startAt, raw.timezone),
    end:   raw.endAt ? new DateTz(raw.endAt, raw.timezone) : undefined,
    color: colorMap[raw.category] ?? 'secondary',
    description: raw.notes,
    // keep original data for edit modal
    _raw: raw
  };
}
```

---

## Toolbar & View Switching

The built-in toolbar shows prev/next navigation and view switcher. To control programmatically:

```typescript
// Switch view
this.calendarView = 'week';

// Navigate to specific date
this.currentDate = new DateTz('2026-06-01', 'Europe/Rome');
```

To hide the toolbar and build a custom one:
```html
<rlb-calendar [show-toolbar]="false" [(view)]="view" [(current-date)]="currentDate" ...>
</rlb-calendar>

<!-- Custom toolbar -->
<div class="d-flex gap-2 mb-3">
  <button rlb-button color="secondary" (click)="prev()">‹</button>
  <button rlb-button color="secondary" (click)="today()">Today</button>
  <button rlb-button color="secondary" (click)="next()">›</button>
  <div class="ms-auto">
    <rlb-button-group>
      <button rlb-button [color]="view==='day'?'primary':'secondary'" (click)="view='day'">Day</button>
      <button rlb-button [color]="view==='week'?'primary':'secondary'" (click)="view='week'">Week</button>
      <button rlb-button [color]="view==='month'?'primary':'secondary'" (click)="view='month'">Month</button>
    </rlb-button-group>
  </div>
</div>
```

---

## Best Practices

1. Always reload events in `(date-change)` to reflect the visible range.
2. Use `[loading]="true"` while fetching events — the calendar shows an overlay.
3. Keep `events` as a new array reference when mutating (`this.events = [...this.events, newEvent]`) to trigger change detection with OnPush.
4. Always create `CalendarEvent.id` as a string; use `crypto.randomUUID()` for new events.
5. Always specify timezone when creating `DateTz` objects; never assume local timezone.
6. Use `color` to encode event categories visually — align with the app's semantic color scheme.
