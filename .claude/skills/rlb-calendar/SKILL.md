---
name: rlb-calendar
description: Expert guidance for the @open-rlb/ng-bootstrap rlb-calendar component: week/month/day views, event create/edit/delete, drag-and-drop, background intervals, and timezone-aware dates. Use when building, configuring, or debugging the calendar component.
---

# RLB ng-Bootstrap Calendar Skill

You are an expert in the **@open-rlb/ng-bootstrap** calendar component (`rlb-calendar`). It provides week, month, and day views with built-in event management (create/edit/delete via modals), drag-and-drop repositioning, background time intervals, and timezone-aware date handling via `@open-rlb/date-tz`.

## Core Types

```typescript
import { IDateTz, DateTz } from '@open-rlb/date-tz';

type CalendarView = 'week' | 'month' | 'day';

// Color type: 'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark'

interface CalendarEvent<T = any> {
  id: string | number;
  title: string;
  start: IDateTz;
  end: IDateTz;
  color?: Color;
  allDay?: boolean;
  data?: T;               // generic payload for custom data
}

interface CalendarInterval {
  dayWeek: number;         // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hourStart?: number;      // Seconds from midnight (0-86400). Defaults to 0.
  hourStop?: number;       // Seconds from midnight (0-86400). Defaults to 86400 (end of day).
  color?: Color;           // Bootstrap color, defaults to 'success'
  label?: string;
}

interface CalendarChangeEvent {
  date: IDateTz;
  view: CalendarView;
}

interface CalendarLayout {
  rowHeight: number;       // px per hour row, default 110
  maxBodyHeight: number;   // rem, scrollable body max height, default 30
  minHeaderHeight: number; // rem, header min height, default 3.5
}
```

---

## Component API

```html
<rlb-calendar
  [(view)]="calendarView"
  [(events)]="calendarEvents"
  [(current-date)]="currentDate"
  [intervals]="businessHours"
  [loading]="isLoading"
  [show-toolbar]="true"
  [manage-events]="true"
  [layout]="layoutOptions"
  (date-change)="onDateChange($event)"
  (view-change)="onViewChange($event)"
  (event-click)="onEventClick($event)"
  (container-event-click)="onContainerEventClick($event)"
></rlb-calendar>
```

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `view` | `CalendarView` (model) | `'week'` | Active view — two-way bindable |
| `events` | `CalendarEvent[]` (model) | `[]` | Events array — two-way bindable. The calendar mutates this via built-in CRUD modals. |
| `current-date` | `IDateTz` (model) | today | Displayed date — two-way bindable |
| `intervals` | `CalendarInterval[]` | `[]` | Background time intervals rendered behind events (e.g. business hours). Non-interactive, purely visual. |
| `loading` | `boolean` | `false` | Show loading progress bar |
| `show-toolbar` | `boolean` | `true` | Show navigation toolbar with prev/today/next and view switcher |
| `manage-events` | `boolean` | `true` | Enable built-in CRUD (modals, toasts). Set to `false` to disable modals and overflow dialogs — `(event-click)`, `(container-event-click)` and DnD still work. |
| `layout` | `Partial<CalendarLayout>` | `{ rowHeight: 110, maxBodyHeight: 30, minHeaderHeight: 3.5 }` | Layout dimensions customization |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `date-change` | `CalendarChangeEvent` | Fired when user navigates dates via toolbar |
| `view-change` | `CalendarChangeEvent` | Fired when view mode changes via toolbar |
| `event-click` | `CalendarEvent` | Fired when user clicks an existing event (before the edit modal opens) |
| `container-event-click` | `CalendarEvent[]` | Fired when the "+N more" overflow indicator is clicked, with the list of hidden events. Always fires regardless of `manage-events`. |

---

## Built-in Event Management

The calendar has **built-in CRUD** — clicking the grid opens a create modal, clicking an event opens an edit modal. The `events` model is updated internally:

- **Create**: Click empty grid area → modal opens → on OK the new event is pushed to `events`
- **Edit**: Click an event → `event-click` output fires → edit modal opens → on OK the event is replaced in `events`
- **Delete**: In the edit modal, clicking Cancel on an existing event deletes it from `events`
- **Drag & Drop**: Dragging an event to a new time/day emits `event-change` internally, which updates `events` and shows a success toast
- **Overflow**: When events overlap beyond visible columns, a "+N more" indicator appears. Clicking it opens a modal listing hidden events with edit/delete actions.

All mutations produce a toast notification (success/warning/info). Since `events` is a model (two-way binding), the parent component is automatically notified of changes via `eventsChange`.

> **Important**: Because the calendar manages its own CRUD, you typically only need to provide initial events and reload them on `(date-change)`. You do NOT need to implement create/edit/delete logic yourself unless you want custom behavior.

### Disabling built-in event management

Set `[manage-events]="false"` to turn off all built-in CRUD:

```html
<rlb-calendar
  [(view)]="view"
  [(events)]="events"
  [manage-events]="false"
  (event-click)="onEventClick($event)"
></rlb-calendar>
```

When disabled:
- Clicking the grid or an event does **not** open any modal
- The "+N more" overflow indicator does **not** open the overflow modal
- Drag-and-drop **still works** — it updates the events array and shows toasts
- `(event-click)` **still fires** — use it to implement your own event handling logic
- `(container-event-click)` **still fires** — use it to handle overflow events externally

---

## Background Intervals

Use `[intervals]` to display non-interactive background highlights — ideal for business hours, availability slots, or recurring time blocks.

```typescript
// Seconds-from-midnight helpers
const HOUR = 3600;

// Business hours: Mon-Fri 09:00-13:00, 14:00-18:00; Sat 09:00-13:00
intervals: CalendarInterval[] = [
  { dayWeek: 1, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'success' },
  { dayWeek: 1, hourStart: 14 * HOUR, hourStop: 18 * HOUR, color: 'success' },
  { dayWeek: 2, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'success' },
  { dayWeek: 2, hourStart: 14 * HOUR, hourStop: 18 * HOUR, color: 'success' },
  { dayWeek: 3, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'success' },
  { dayWeek: 3, hourStart: 14 * HOUR, hourStop: 18 * HOUR, color: 'success' },
  { dayWeek: 4, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'success' },
  { dayWeek: 4, hourStart: 14 * HOUR, hourStop: 18 * HOUR, color: 'success' },
  { dayWeek: 5, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'success' },
  { dayWeek: 5, hourStart: 14 * HOUR, hourStop: 18 * HOUR, color: 'success' },
  { dayWeek: 6, hourStart: 9 * HOUR, hourStop: 13 * HOUR, color: 'info' },
];
```

### Rendering per view

| View | Rendering |
|------|-----------|
| **Week** | Semi-transparent colored blocks in each matching day column, positioned between grid lines and events |
| **Day** | Same as week but single column |
| **Month** | Matching day cells get a colored left border and subtle gradient background |

### Key details

- `hourStart` / `hourStop` are in **seconds from midnight** (0–86400), enabling sub-hour precision (e.g. `9.5 * 3600 = 34200` for 09:30)
- If omitted, `hourStart` defaults to `0` (midnight) and `hourStop` to `86400` (end of day) — highlighting the full day
- Multiple intervals can target the same `dayWeek` (e.g. morning + afternoon blocks)
- Intervals have `pointer-events: none` and sit behind events — they never interfere with clicks or drag-and-drop
- `color` maps to Bootstrap CSS variables (`var(--bs-success)`, etc.)

---

## Basic Usage

```typescript
import { Component, signal } from '@angular/core';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import {
  CalendarEvent,
  CalendarInterval,
  CalendarView,
  CalendarChangeEvent
} from '@open-rlb/ng-bootstrap';

@Component({
  template: `
    <rlb-calendar
      [(view)]="view"
      [(events)]="events"
      [(current-date)]="currentDate"
      [intervals]="intervals"
      [loading]="loading()"
      (date-change)="onDateChange($event)"
      (event-click)="onEventClick($event)"
    ></rlb-calendar>
  `
})
export class MyCalendarComponent {
  view: CalendarView = 'week';
  currentDate: IDateTz = new DateTz();
  loading = signal(false);

  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new DateTz('2026-05-14T09:00:00', 'Europe/Rome'),
      end:   new DateTz('2026-05-14T10:00:00', 'Europe/Rome'),
      color: 'primary'
    }
  ];

  intervals: CalendarInterval[] = [
    { dayWeek: 1, hourStart: 32400, hourStop: 64800, color: 'success' }, // Mon 09:00-18:00
  ];

  onDateChange(event: CalendarChangeEvent) {
    this.loadEvents(event.date, event.view);
  }

  onEventClick(event: CalendarEvent) {
    console.log('Clicked:', event);
    // The built-in edit modal opens automatically after this
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

## Custom Event Handling (Override Built-in CRUD)

If you need to bypass the built-in modals and handle events yourself, listen to `(event-click)` and manage `events` externally:

```typescript
// Handle event click with your own modal
onEventClick(event: CalendarEvent) {
  this.myModal.open(event).subscribe(result => {
    if (result.action === 'save') {
      this.events = this.events.map(e =>
        e.id === result.data.id ? result.data : e
      );
    } else if (result.action === 'delete') {
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

// Update event (e.g. after external drag-drop)
updateEvent(updated: CalendarEvent) {
  this.events = this.events.map(e =>
    e.id === updated.id ? updated : e
  );
}

// Remove event
removeEvent(id: string | number) {
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
    end:   new DateTz(raw.endAt, raw.timezone),
    color: colorMap[raw.category] ?? 'secondary',
    data:  raw   // store original payload in the generic data field
  };
}
```

---

## Layout Customization

```typescript
// Make rows taller (more space for events)
layout: Partial<CalendarLayout> = {
  rowHeight: 140,        // px per hour (default 110)
  maxBodyHeight: 40,     // rem max scroll height (default 30)
  minHeaderHeight: 4,    // rem header height (default 3.5)
};
```

The `rowHeight` value directly affects:
- Event height in week/day views (duration in minutes / 60 * rowHeight)
- Interval block heights (seconds / 3600 * rowHeight)
- Time slot grid row heights
- Drag-and-drop snap positioning (15-minute snap intervals)

---

## Toolbar & View Switching

The built-in toolbar shows prev/next navigation, a "Today" button, and a view dropdown. To control programmatically:

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

## View-specific Behavior

### Week View
- 7 day columns (Monday → Sunday), 24 hour rows
- Events split at day boundaries (cross-day events show continuation indicators)
- Overlapping events arranged in columns (max 4 visible, overflow shows "+N more")
- Red "now" line on today's column, updates every minute
- Drag-and-drop with 15-minute snap intervals
- Horizontal scroll synced between header and body

### Day View
- Single day column, 24 hour rows
- Same event rendering as week but more generous column space (max 10 visible columns)
- Red "now" line if viewing today

### Month View
- 6-week grid (42 cells), events placed using a "Tetris" algorithm for consistent vertical positioning
- Multi-day events span cells with continuation styling (rounded corners removed on continued sides)
- Max 3 events visible per cell, overflow shows "+N more" with click-to-expand modal
- Drag-and-drop preserves original event duration

---

## Best Practices

1. Always reload events in `(date-change)` to reflect the visible range.
2. Use `[loading]="true"` while fetching events — the calendar shows a progress bar.
3. Keep `events` as a new array reference when mutating externally (`this.events = [...this.events, newEvent]`) to trigger change detection with OnPush.
4. `CalendarEvent.id` can be `string | number`; use `crypto.randomUUID()` for new events.
5. `CalendarEvent.end` is **required** — always provide both `start` and `end`.
6. Always specify timezone when creating `DateTz` objects; never assume local timezone.
7. Use `color` to encode event categories visually — align with the app's semantic color scheme.
8. Use `intervals` for static recurring visual blocks (business hours, shifts). They are non-interactive and render behind events.
9. Express interval times in **seconds from midnight** for maximum precision (multiply hours by 3600).
