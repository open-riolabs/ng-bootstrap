import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from "@angular/core";
import { IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "../../interfaces/calendar-view.type";
import { CalendarEvent, CalendarEventWithLayout } from "../../interfaces/calendar-event.interface";
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { getToday, isSameDay, isToday } from "../../utils/calendar-date-utils";

@Component({
  selector: 'rlb-calendar-week-grid',
  templateUrl: './calendar-week-grid.component.html',
  styleUrls: ['./calendar-week-grid.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWeekGridComponent implements OnChanges, OnDestroy {
  @Input() view!: CalendarView;
  @Input() currentDate!: IDateTz;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEventWithLayout[] | undefined>();

  days: IDateTz[] = [];
  timeSlots: string[] = [];
  processedEvents: Map<number, CalendarEventWithLayout[]> = new Map();

  now: DateTz;
  private nowInterval: any;

  rowHeight = 100; // px for a full hour slot
  maxBodyHeight: number = 30; // rem
  private readonly MAX_VISIBLE_COLUMNS = 4;

  constructor(
  ) {
    this.now = getToday()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['view'] || changes['currentDate']) {
      if (this.view === 'week') {
        this.buildWeekGrid(this.currentDate);
        this.buildTimeSlots();
      }
    }

    if (changes['events']) {
      this.events = changes['events'].currentValue as CalendarEvent[];
      this.processAllEvents();
    }
  }

  ngOnDestroy() {
    this.stopNowTimer();
  }

  onEventEdit(event?: CalendarEventWithLayout): void {
    this.eventClick.emit(event);
  }

  getEventsForHour(day: IDateTz, time: string): CalendarEventWithLayout[] {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    const startOfHour = new DateTz(day)
      .set(hour, 'hour')
      .set(0, 'minute')

    const endOfHour = new DateTz(startOfHour.timestamp, 'UTC').add(1, 'hour');

    const dayStartTz = new DateTz(day.timestamp, 'UTC')
      .set(0, 'hour')
      .set(0, 'minute');

    const dayTimestamp = dayStartTz.stripSecMillis().timestamp

    const dayEvents = this.processedEvents.get(dayTimestamp) || [];

    const filteredDayEvents = dayEvents.filter(event => {
      const eventStart = event.start;
      const eventEnd = event.end;

      const eventStartsBeforeEndOfHour = eventStart.compare!(endOfHour) < 0; // eventStart < endOfHour
      const eventEndsAfterStartOfHour = eventEnd.compare!(startOfHour) > 0; // eventEnd > startOfHour

      return eventStartsBeforeEndOfHour && eventEndsAfterStartOfHour;
    });

    return filteredDayEvents;
  }

  isCurrentDay(day: IDateTz): boolean {
    return isSameDay(day, this.now);
  }

  isToday(date: IDateTz): boolean {
    return isToday(date)
  }

  isCurrentHour(time: string): boolean {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    return hour === this.now.hour;
  }

  calculateNowLineTop(): number {
    const currentMinute = this.now.minute;
    return (currentMinute / 60) * this.rowHeight;
  }

  private startNowTimer() {
    this.nowInterval = setInterval(() => {
      this.now = getToday();
    }, 60 * 1000); // every minute
  }

  private stopNowTimer() {
    if (this.nowInterval) {
      clearInterval(this.nowInterval);
    }
  }

  private buildWeekGrid(currentDate: IDateTz) {
    const dayOfWeek = currentDate.dayOfWeek!; // 0 = Sunday, 1 = Monday ...

    // Week init (monday)
    const start = new DateTz(currentDate.timestamp, 'UTC')
      .add!(-(dayOfWeek - 1), 'day') // clone or create new for start date
      .set!(0, 'hour')
      .set!(0, 'minute')
      .stripSecMillis!();

    this.days = [];
    for (let i = 0; i < 7; i++) {
      this.days.push(new DateTz(start.timestamp, 'UTC').add(i, 'day'));
    }
    this.startNowTimer();
  }

  private buildTimeSlots() {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    this.timeSlots = slots;
  }

  private isOverlapping(eventA: CalendarEvent, eventB: CalendarEvent): boolean {
    const startA = eventA.start.timestamp;
    const endA = eventA.end.timestamp;
    const startB = eventB.start.timestamp;
    const endB = eventB.end.timestamp;
    return startA < endB && startB < endA;
  }

  private processAllEvents() {
    this.processedEvents.clear();

    const eventsByDay = new Map<number, CalendarEvent[]>();

    for (const event of this.events) {
      // clean input events from ms offset
      const cleanStart = new DateTz(event.start).stripSecMillis() as DateTz;
      const cleanEnd = new DateTz(event.end).stripSecMillis() as DateTz;
      const cleanEvent: CalendarEvent = { ...event, start: cleanStart, end: cleanEnd };

      let currentDateStartOfDay = new DateTz(cleanStart)
        .set(0, 'hour')
        .set(0, 'minute')
        .stripSecMillis() as DateTz;

      const dayAfterEnd = new DateTz(cleanEnd)
        .add!(1, 'day')
        .set!(0, 'hour')
        .set!(0, 'minute')
        .stripSecMillis!() as DateTz;


      while (currentDateStartOfDay.compare!(dayAfterEnd) < 0) {
        const dayTimestamp = currentDateStartOfDay.timestamp;

        if (!eventsByDay.has(dayTimestamp)) {
          eventsByDay.set(dayTimestamp, []);
        }
        eventsByDay.get(dayTimestamp)!.push(cleanEvent);

        currentDateStartOfDay = currentDateStartOfDay.add(1, 'day') as DateTz;
      }
    }

    for (const [dayTimestamp, dayEvents] of eventsByDay.entries()) {
      const groups = this.groupEventsByConflicts(dayEvents);

      const eventsWithLayout: CalendarEventWithLayout[] = [];

      for (const group of groups) {
        const groupLayouts = this.resolveConflictGroupLayout(group);
        eventsWithLayout.push(...groupLayouts);
      }

      this.processedEvents.set(dayTimestamp, eventsWithLayout);
    }
  }

  private getMaxConcurrentEvents(groupEvents: CalendarEvent[]): number {
    if (groupEvents.length === 0) return 0;

    const sortedEvents = [...groupEvents].sort((a, b) => a.start.compare!(b.start));

    let maxConcurrent = 0;
    const activeEnds: number[] = [];

    for (const event of sortedEvents) {
      const start = event.start.timestamp;

      for (let i = activeEnds.length - 1; i >= 0; i--) {
        if (activeEnds[i] <= start) {
          activeEnds.splice(i, 1);
        }
      }

      activeEnds.push(event.end.timestamp);

      maxConcurrent = Math.max(maxConcurrent, activeEnds.length);
    }

    return maxConcurrent;
  }

  private groupEventsByConflicts(dayEvents: CalendarEvent[]): CalendarEvent[][] {
    if (dayEvents.length === 0) return [];

    const groups: CalendarEvent[][] = [];
    const visited = new Map<CalendarEvent, boolean>();

    for (const event of dayEvents) {
      if (visited.get(event)) continue;

      const currentGroup: CalendarEvent[] = [];
      const queue: CalendarEvent[] = [event];
      visited.set(event, true);

      while (queue.length > 0) {
        const current = queue.shift()!;
        currentGroup.push(current);

        for (const other of dayEvents) {
          if (!visited.get(other) && this.isOverlapping(current, other)) {
            visited.set(other, true);
            queue.push(other);
          }
        }
      }
      groups.push(currentGroup);
    }
    return groups;
  }

  private resolveConflictGroupLayout(groupEvents: CalendarEvent[]): CalendarEventWithLayout[] {
    if (!groupEvents || groupEvents.length === 0) return [];

    const maxColumns = this.getMaxConcurrentEvents(groupEvents);

    // case 1 -> full width event
    if (maxColumns <= 1) {
      return groupEvents.map(event => ({ ...event, left: 0, width: 100 }));
    }

    const sortedEvents = [...groupEvents].sort((a, b) => a.start.compare!(b.start));

    // case 2 -> less than max events per hour
    if (maxColumns <= this.MAX_VISIBLE_COLUMNS) {
      const columnWidth = 100 / maxColumns;

      const processedEvents: CalendarEventWithLayout[] = [];

      const columnEnds: number[] = new Array(maxColumns).fill(-Infinity);

      const eventToColumnMap = new Map<CalendarEvent, number>();

      for (const event of sortedEvents) {
        let assignedColumn = -1
        for (let col = 0; col < maxColumns; col++) {
          if (columnEnds[col] <= event.start.timestamp) {
            assignedColumn = col;
            break;
          }
        }

        if (assignedColumn === -1) {
          let minEnd = Infinity;
          for (let col = 0; col < maxColumns; col++) {
            if (columnEnds[col] < minEnd) {
              minEnd = columnEnds[col];
              assignedColumn = col;
            }
          }
        }

        const eventWithLayout: CalendarEventWithLayout = {
          ...event,
          left: assignedColumn * columnWidth,
          width: columnWidth,
        };

        columnEnds[assignedColumn] = event.end.timestamp;

        processedEvents.push(eventWithLayout);
        eventToColumnMap.set(event, assignedColumn);
      }

      return processedEvents;
    }

    // case 3 -> too many events to render in a single cell -> generic events container

    const visualMaxColumns = this.MAX_VISIBLE_COLUMNS;
    const columnWidth = 100 / visualMaxColumns;
    const overflowColumnIndex = visualMaxColumns - 1;

    const processedEvents: CalendarEventWithLayout[] = [];
    const hiddenEvents: CalendarEventWithLayout[] = [];

    const trueColumnEnds: number[] = new Array(maxColumns).fill(-Infinity);

    for (const event of sortedEvents) {
      let assignedCol = -1;

      for (let col = 0; col < maxColumns; col++) {
        if (trueColumnEnds[col] <= event.start.timestamp) {
          assignedCol = col;
          break;
        }
      }

      if (assignedCol === -1) {
        let minEnd = Infinity;
        for (let col = 0; col < maxColumns; col++) {
          if (trueColumnEnds[col] < minEnd) {
            minEnd = trueColumnEnds[col];
            assignedCol = col;
          }
        }
      }

      trueColumnEnds[assignedCol] = event.end.timestamp;

      if (assignedCol < overflowColumnIndex) {
        const eventWithLayout: CalendarEventWithLayout = {
          ...event,
          left: assignedCol * columnWidth,
          width: columnWidth,
        };
        processedEvents.push(eventWithLayout);

      } else {
        const eventWithLayout: CalendarEventWithLayout = {
          ...event,
          // Visually align with the indicator column
          left: overflowColumnIndex * columnWidth,
          width: columnWidth,
        };
        hiddenEvents.push(eventWithLayout);
      }
    }

    if (hiddenEvents.length > 0) {
      const minStart = hiddenEvents.reduce((min, e) => Math.min(min, e.start.timestamp), Infinity);
      const maxEnd = hiddenEvents.reduce((max, e) => Math.max(max, e.end.timestamp), -Infinity);

      const overflowIndicator: CalendarEventWithLayout = {
        id: -1,
        title: `+${hiddenEvents.length} more`,
        start: new DateTz(minStart),
        end: new DateTz(maxEnd),
        color: 'light',

        left: overflowColumnIndex * columnWidth,
        width: columnWidth,

        isOverflowIndicator: true,
        overflowEvents: hiddenEvents,
        overlapCount: hiddenEvents.length
      };

      processedEvents.push(overflowIndicator);
    }

    return processedEvents;
  }
}
