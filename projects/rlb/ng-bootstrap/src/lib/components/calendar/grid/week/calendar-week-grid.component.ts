import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild
} from "@angular/core";
import { IDateTz } from "@open-rlb/date-tz";
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { CalendarEvent, CalendarEventWithLayout } from "../../interfaces/calendar-event.interface";
import { CalendarInterval } from "../../interfaces/calendar-interval.interface";
import { CalendarLayout } from "../../interfaces/calendar-layout.interface";
import { CalendarView } from "../../interfaces/calendar-view.type";
import { dayAt, getToday, isToday, minutesSinceMidnight, startOfDayTs } from "../../utils/calendar-date-utils";

import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { DateTzPipe } from "../../../../pipes/date-tz.pipe";
import { DayOfWeekPipe } from "../../../../pipes/day-formatter.pipe";
import { CalendarEventComponent } from "../../event/calendar-event.component";


@Component({
  selector: 'rlb-calendar-week-grid',
  templateUrl: './calendar-week-grid.component.html',
  styleUrls: ['./calendar-week-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropListGroup, CdkDropList, CalendarEventComponent, CdkDrag, CdkDragPlaceholder, DateTzPipe, DayOfWeekPipe]
})
export class CalendarWeekGridComponent implements OnDestroy, AfterViewInit {
  view = input.required<CalendarView>();
  currentDate = input.required<IDateTz>();
  events = input<CalendarEvent[]>([]);
  intervals = input<CalendarInterval[]>([]);
  timezone = input.required<string>();
  layout = input.required<CalendarLayout>();

  eventClick = output<CalendarEvent | undefined>({ alias: 'event-click' });
  eventContainerClick = output<CalendarEvent[] | undefined>({ alias: 'event-container-click' });
  eventChange = output<CalendarEvent>({ alias: 'event-change' });

  days = signal<IDateTz[]>([]);
  timeSlots = signal<string[]>([]);
  processedEvents = signal<Map<number, CalendarEventWithLayout[]>>(new Map());

  scrollBodyRef = viewChild<ElementRef<HTMLDivElement>>('scrollBody');
  headerRowRef = viewChild<ElementRef<HTMLDivElement>>('headerRow');
  scrollbarWidth = signal(0);

  now = signal<DateTz>(getToday());
  private nowInterval: any;

  // CONFIG CONSTANTS (Replaced by Layout Input)
  private readonly MAX_VISIBLE_COLUMNS = 4;
  private readonly SNAP_MINUTES = 15;


  constructor() {
    effect(() => {
      if (this.view() === 'week') {
        this.buildWeekGrid(this.currentDate());
        this.buildTimeSlots();
      }
    });

    effect(() => {
      this.processAllEvents(this.events());
    });

    // Keep the "now" line in the calendar timezone.
    effect(() => {
      this.now.set(getToday(this.timezone()));
    });
  }

  ngAfterViewInit() {
    this.updateScrollbarWidth();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    this.stopNowTimer();
    window.removeEventListener('resize', this.onResize);
  }

  // arrow function to keep "this" context
  private onResize = () => {
    this.updateScrollbarWidth();
  };

  private updateScrollbarWidth() {
    const scrollBody = this.scrollBodyRef();
    if (scrollBody) {
      const el = scrollBody.nativeElement;
      this.scrollbarWidth.set(el.offsetWidth - el.clientWidth);
    }
  }

  onBodyScroll(event: Event) {
    const headerRow = this.headerRowRef();
    const scrollBody = this.scrollBodyRef();
    if (headerRow && scrollBody) {
      headerRow.nativeElement.scrollLeft = scrollBody.nativeElement.scrollLeft;
    }
  }

  trackByEventId(index: number, item: CalendarEventWithLayout): string | number {
    return item.id;
  }

  onEventDrop(event: CdkDragDrop<IDateTz, any, CalendarEventWithLayout>) {
    const movedEvent = event.item.data as CalendarEventWithLayout;
    const newDay = event.container.data;

    const originalTopPx = this.calculateEventTop(movedEvent);
    const dragDistancePx = event.distance.y;
    const newTopPx = originalTopPx + dragDistancePx;

    const rawMinutesFromStart = (newTopPx / this.layout().rowHeight) * 60;
    const snappedMinutes = Math.round(rawMinutesFromStart / this.SNAP_MINUTES) * this.SNAP_MINUTES;
    const validMinutes = Math.max(0, snappedMinutes);

    // Local midnight of the target day + dropped offset (tz-aware).
    const tz = this.timezone();
    const newStartTs = startOfDayTs(newDay, tz) + validMinutes * 60 * 1000;
    const newStart = new DateTz(newStartTs, tz).stripSecMillis!();

    const durationMs = movedEvent.end.timestamp - movedEvent.start.timestamp;
    const newEnd = new DateTz(newStart.timestamp + durationMs, tz).stripSecMillis();

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
    return this.processedEvents().get(startOfDayTs(day, this.timezone())) || [];
  }

  calculateEventTop(event: CalendarEventWithLayout): number {
    const diffMinutes = minutesSinceMidnight(event.start, this.timezone());
    return (diffMinutes / 60) * this.layout().rowHeight;
  }


  calculateEventHeight(event: CalendarEventWithLayout): number {
    const durationMs = event.end.timestamp - event.start.timestamp;
    const durationMinutes = durationMs / (1000 * 60);
    return (durationMinutes / 60) * this.layout().rowHeight;
  }


  getNowTop(): number {
    const now = this.now();
    const hours = now.hour;
    const minutes = now.minute;
    return ((hours * 60) + minutes) / 60 * this.layout().rowHeight;
  }


  isToday(date: IDateTz): boolean {
    return isToday(date, this.timezone());
  }

  private startNowTimer() {
    if (this.nowInterval) return;
    this.nowInterval = setInterval(() => {
      this.now.set(getToday(this.timezone()));
    }, 60 * 1000); // every minute
  }

  private stopNowTimer() {
    if (this.nowInterval) {
      clearInterval(this.nowInterval);
      this.nowInterval = null;
    }
  }

  getIntervalsForDay(day: IDateTz): CalendarInterval[] {
    const dayOfWeek = new DateTz(day).dayOfWeek as number; // 0=Sun, 1=Mon...
    return this.intervals().filter(interval => interval.dayWeek === dayOfWeek);
  }

  getIntervalTop(interval: CalendarInterval): number {
    const seconds = interval.hourStart ?? 0;
    return (seconds / 3600) * this.layout().rowHeight;
  }

  getIntervalHeight(interval: CalendarInterval): number {
    const start = interval.hourStart ?? 0;
    const stop = interval.hourStop ?? 86400;
    return ((stop - start) / 3600) * this.layout().rowHeight;
  }

  getIntervalColor(interval: CalendarInterval): string {
    return `var(--bs-${interval.color || 'success'})`;
  }

  private buildWeekGrid(currentDate: IDateTz) {
    const tz = this.timezone();
    const dayOfWeek = currentDate.cloneToTimezone!(tz).dayOfWeek!; // 0 = Sunday, 1 = Monday ...
    // Offset (in days) from currentDate back to the week's Monday.
    const mondayOffset = 1 - dayOfWeek; // Sun(0) -> +1, Mon(1) -> 0, Tue(2) -> -1 ...

    const newDays: IDateTz[] = [];
    for (let i = 0; i < 7; i++) {
      newDays.push(dayAt(currentDate, tz, mondayOffset + i));
    }
    this.days.set(newDays);
    this.startNowTimer();
  }

  private buildTimeSlots() {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    this.timeSlots.set(slots);
  }

  private isOverlapping(eventA: CalendarEvent, eventB: CalendarEvent): boolean {
    const startA = eventA.start.timestamp;
    const endA = eventA.end.timestamp;
    const startB = eventB.start.timestamp;
    const endB = eventB.end.timestamp;
    return startA < endB && startB < endA;
  }

  private processAllEvents(events: CalendarEvent[]) {
    const eventsByDay = new Map<number, CalendarEventWithLayout[]>();

    const tz = this.timezone();

    for (const event of events) {
      const originalStartTs = new DateTz(event.start).stripSecMillis!().timestamp;
      const originalEndTs = new DateTz(event.end).stripSecMillis!().timestamp;

      let chunkStartTs = originalStartTs;

      while (chunkStartTs < originalEndTs) {
        const chunkInst: IDateTz = new DateTz(chunkStartTs, tz);
        // tz-aware day boundaries (set()/add() would be UTC-naive here).
        const dayStartTs = startOfDayTs(chunkInst, tz);
        const startOfNextDayTs = dayAt(chunkInst, tz, 1).timestamp;
        const chunkEndTs = Math.min(originalEndTs, startOfNextDayTs);

        const visualEvent: CalendarEventWithLayout = {
          ...event,
          // Chunks live in the calendar timezone, so labels and positions agree.
          start: new DateTz(chunkStartTs, tz),
          end: new DateTz(chunkEndTs, tz),
          isContinuedBefore: chunkStartTs > originalStartTs,
          isContinuedAfter: chunkEndTs < originalEndTs,
          left: 0,
          width: 0
        };

        if (!eventsByDay.has(dayStartTs)) {
          eventsByDay.set(dayStartTs, []);
        }

        eventsByDay.get(dayStartTs)!.push(visualEvent);

        chunkStartTs = startOfNextDayTs;
      }
    }

    const newProcessedEvents = new Map<number, CalendarEventWithLayout[]>();
    for (const [dayTimestamp, dayEvents] of eventsByDay.entries()) {

      const sortedDayEvents = this.sortEventsStable(dayEvents);
      const groups = this.groupEventsByConflicts(sortedDayEvents);
      const eventsWithLayout: CalendarEventWithLayout[] = [];

      for (const group of groups) {
        const groupLayouts = this.resolveConflictGroupLayout(group);
        eventsWithLayout.push(...groupLayouts);
      }

      newProcessedEvents.set(dayTimestamp, eventsWithLayout);
    }
    this.processedEvents.set(newProcessedEvents);
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

    const columns: CalendarEventWithLayout[][] = [];
    const columnLastEndTimes: number[] = [];

    for (const event of groupEvents) {
      let assignedCol = -1;

      for (let i = 0; i < columnLastEndTimes.length; i++) {
        if (columnLastEndTimes[i] <= event.start.timestamp) {
          assignedCol = i;
          break;
        }
      }

      if (assignedCol === -1) {
        assignedCol = columns.length;
        columns.push([]);
        columnLastEndTimes.push(0);
      }

      columns[assignedCol].push(event as CalendarEventWithLayout);
      columnLastEndTimes[assignedCol] = event.end.timestamp;
    }

    const totalColumns = columns.length;
    const resultEvents: CalendarEventWithLayout[] = [];

    // Case 1: All visible
    if (totalColumns <= this.MAX_VISIBLE_COLUMNS) {
      const colWidth = 100 / totalColumns;

      columns.forEach((colEvents, colIndex) => {
        colEvents.forEach(event => {
          resultEvents.push({
            ...event,
            left: colIndex * colWidth,
            width: colWidth
          });
        });
      });
    }
    // Case 2 (Overflow)
    else {
      const visibleColsCount = this.MAX_VISIBLE_COLUMNS - 1;
      const colWidth = 100 / this.MAX_VISIBLE_COLUMNS;
      const hiddenEvents: CalendarEventWithLayout[] = [];

      for (let i = 0; i < visibleColsCount; i++) {
        columns[i].forEach(event => {
          resultEvents.push({
            ...event,
            left: i * colWidth,
            width: colWidth
          });
        });
      }

      for (let i = visibleColsCount; i < totalColumns; i++) {
        columns[i].forEach(event => {
          hiddenEvents.push({
            ...event,
            left: visibleColsCount * colWidth,
            width: colWidth
          });
        });
      }

      if (hiddenEvents.length > 0) {
        const minStart = hiddenEvents.reduce((min, e) => Math.min(min, e.start.timestamp), Infinity);
        const maxEnd = hiddenEvents.reduce((max, e) => Math.max(max, e.end.timestamp), -Infinity);

        resultEvents.push({
          id: -9999,
          title: `+${hiddenEvents.length} more`,
          start: new DateTz(minStart, this.timezone()),
          end: new DateTz(maxEnd, this.timezone()),
          color: 'light',
          left: visibleColsCount * colWidth,
          width: colWidth,
          isOverflowIndicator: true,
          overflowEvents: hiddenEvents,
          overlapCount: hiddenEvents.length
        });
      }
    }

    return resultEvents;
  }

  private sortEventsStable(events: CalendarEvent[]): CalendarEvent[] {
    return [...events].sort((a, b) => {
      const diff = a.start.timestamp - b.start.timestamp;
      if (diff !== 0) return diff;

      const durA = a.end.timestamp - a.start.timestamp;
      const durB = b.end.timestamp - b.start.timestamp;
      if (durB !== durA) return durB - durA;

      const idA = a.id ? a.id.toString() : a.title;
      const idB = b.id ? b.id.toString() : b.title;
      return idA.localeCompare(idB);
    });
  }
}
