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
import { getToday, isToday } from "../../utils/calendar-date-utils";
import { CdkDragDrop } from "@angular/cdk/drag-drop";


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
  @Output() eventChange = new EventEmitter<CalendarEvent>();

  days: IDateTz[] = [];
  timeSlots: string[] = [];
  processedEvents: Map<number, CalendarEventWithLayout[]> = new Map();

  now: DateTz;
  private nowInterval: any;

  rowHeight = 100; // px for a full hour slot
  maxBodyHeight: number = 30; // rem
  private readonly MAX_VISIBLE_COLUMNS = 4;
  private readonly SNAP_MINUTES = 15;


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


  onEventDrop(event: CdkDragDrop<IDateTz, any, CalendarEventWithLayout>) {
    const movedEvent = event.item.data as CalendarEventWithLayout;
    const newDay = event.container.data;

    const columnRect = event.container.element.nativeElement.getBoundingClientRect();
    const relativeY = event.dropPoint.y - columnRect.top;

    const rawMinutesFromStart = (relativeY / this.rowHeight) * 60;

    const snappedMinutes = Math.round(rawMinutesFromStart / this.SNAP_MINUTES) * this.SNAP_MINUTES;

    const validMinutes = Math.max(0, snappedMinutes);

    const newStart = new DateTz(newDay)
      .set(0, 'hour')
      .set(0, 'minute')
      .add(validMinutes, 'minute')
      .stripSecMillis!()


    const durationMs = movedEvent.end.timestamp - movedEvent.start.timestamp;
    const newEnd = new DateTz(newStart.timestamp + durationMs);

    if (newStart.timestamp !== movedEvent.start.timestamp) {
      const updatedEvent: CalendarEvent = {
        ...movedEvent,
        start: newStart,
        end: newEnd,
      };

      this.eventChange.emit(updatedEvent);
    }
  }


  getEventsForDay(day: IDateTz): CalendarEventWithLayout[] {
    const dayTs = new DateTz(day.timestamp, 'UTC').set(0, 'hour').set(0, 'minute').stripSecMillis().timestamp;
    return this.processedEvents.get(dayTs) || [];
  }

  calculateEventTop(event: CalendarEventWithLayout): number {
    const startOfDay = new DateTz(event.start).set(0, 'hour').set(0, 'minute').stripSecMillis();
    const diffMs = event.start.timestamp - startOfDay.timestamp;
    const diffMinutes = diffMs / (1000 * 60);
    return (diffMinutes / 60) * this.rowHeight;
  }

  calculateEventHeight(event: CalendarEventWithLayout): number {
    const durationMs = event.end.timestamp - event.start.timestamp;
    const durationMinutes = durationMs / (1000 * 60);
    return (durationMinutes / 60) * this.rowHeight;
  }

  getNowTop(): number {
    const hours = this.now.hour;
    const minutes = this.now.minute;
    return ((hours * 60) + minutes) / 60 * this.rowHeight;
  }

  isToday(date: IDateTz): boolean {
    return isToday(date)
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

    const eventsByDay = new Map<number, CalendarEventWithLayout[]>();

    for (const event of this.events) {
      const originalStart = new DateTz(event.start);
      const originalEnd = new DateTz(event.end);

      let currentChunkStart: IDateTz = new DateTz(originalStart);

      while (currentChunkStart.timestamp < originalEnd.timestamp) {

        const startOfNextDay = new DateTz(currentChunkStart).set(0, 'hour')
          .set(0, 'minute')
          .add(1, 'day')
          .stripSecMillis!()

        const chunkEndTimestamp = Math.min(originalEnd.timestamp, startOfNextDay!.timestamp);
        const chunkEnd = new DateTz(chunkEndTimestamp);

        const currentDayStart = new DateTz(currentChunkStart)
          .set(0, 'hour')
          .set(0, 'minute')
          .stripSecMillis();

        const dayTimestamp = currentDayStart.timestamp;

        const isContinuedBefore = currentChunkStart.timestamp > originalStart.timestamp;
        const isContinuedAfter = chunkEnd.timestamp < originalEnd.timestamp;

        const visualEvent: CalendarEventWithLayout = {
          ...event,
          start: currentChunkStart,
          end: chunkEnd,
          isContinuedBefore: isContinuedBefore,
          isContinuedAfter: isContinuedAfter,
          left: 0,
          width: 0
        }

        if (!eventsByDay.has(dayTimestamp)) {
          eventsByDay.set(dayTimestamp, []);
        }
        eventsByDay.get(dayTimestamp)!.push(visualEvent);

        currentChunkStart = startOfNextDay;
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

}
