import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
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
export class CalendarWeekGridComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() view!: CalendarView;
  @Input() currentDate!: IDateTz;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEvent[] | undefined>();
  @Output() eventChange = new EventEmitter<CalendarEvent>();

  days: IDateTz[] = [];
  timeSlots: string[] = [];
  processedEvents: Map<number, CalendarEventWithLayout[]> = new Map();

  @ViewChild('scrollBody', { static: false }) scrollBodyRef!: ElementRef<HTMLDivElement>;
  @ViewChild('headerRow', { static: false }) headerRowRef!: ElementRef<HTMLDivElement>;
  scrollbarWidth: number = 0;

  now: DateTz;
  private nowInterval: any;

  // CONFIG CONSTANTS
  readonly ROW_HEIGHT = 110; // px for a full hour slot
  readonly MAX_BODY_HEIGHT: number = 30; // rem
  readonly MIN_HEADER_HEIGHT = 3.5 // rem
  private readonly MAX_VISIBLE_COLUMNS = 4;
  private readonly SNAP_MINUTES = 15;


  constructor(
    private cd: ChangeDetectorRef,
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

  ngAfterViewInit() {
    this.updateScrollbarWidth();
    window.addEventListener('resize', this.onResize);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.stopNowTimer();
    window.removeEventListener('resize', this.onResize);
  }

  // arrow function to keep "this" context
  private onResize = () => {
    this.updateScrollbarWidth();
  }

  private updateScrollbarWidth() {
    if (this.scrollBodyRef) {
      const el = this.scrollBodyRef.nativeElement;
      this.scrollbarWidth = el.offsetWidth - el.clientWidth;
    }
  }

  onBodyScroll(event: Event) {
    if (this.headerRowRef && this.scrollBodyRef) {
      this.headerRowRef.nativeElement.scrollLeft = this.scrollBodyRef.nativeElement.scrollLeft;
    }
  }

  trackByEventId(index: number, item: CalendarEventWithLayout): string | number {
    return item.id
  }

  onEventDrop(event: CdkDragDrop<IDateTz, any, CalendarEventWithLayout>) {
    const movedEvent = event.item.data as CalendarEventWithLayout;
    const newDay = event.container.data;

    const originalTopPx = this.calculateEventTop(movedEvent);

    const dragDistancePx = event.distance.y;

    const newTopPx = originalTopPx + dragDistancePx;

    const rawMinutesFromStart = (newTopPx / this.ROW_HEIGHT) * 60;

    const snappedMinutes = Math.round(rawMinutesFromStart / this.SNAP_MINUTES) * this.SNAP_MINUTES;

    const validMinutes = Math.max(0, snappedMinutes);

    const newStart = new DateTz(newDay)
      .set(0, 'hour')
      .set(0, 'minute')
      .add(validMinutes, 'minute')
      .stripSecMillis!();

    const durationMs = movedEvent.end.timestamp - movedEvent.start.timestamp;
    const newEnd = new DateTz(newStart.timestamp + durationMs).stripSecMillis();

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
    return (diffMinutes / 60) * this.ROW_HEIGHT;
  }

  calculateEventHeight(event: CalendarEventWithLayout): number {
    const durationMs = event.end.timestamp - event.start.timestamp;
    const durationMinutes = durationMs / (1000 * 60);
    return (durationMinutes / 60) * this.ROW_HEIGHT;
  }

  getNowTop(): number {
    const hours = this.now.hour;
    const minutes = this.now.minute;
    return ((hours * 60) + minutes) / 60 * this.ROW_HEIGHT;
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
      const originalStart = new DateTz(event.start).stripSecMillis!();
      const originalEnd = new DateTz(event.end).stripSecMillis!();

      let currentChunkStart: IDateTz = new DateTz(originalStart);

      while (currentChunkStart.timestamp < originalEnd.timestamp) {
        const startOfNextDay = new DateTz(currentChunkStart)
          .set(0, 'hour')
          .set(0, 'minute')
          .add(1, 'day')
          .stripSecMillis!();

        const chunkEndTimestamp = Math.min(originalEnd.timestamp, startOfNextDay.timestamp);
        const chunkEnd = new DateTz(chunkEndTimestamp);

        const currentDayStart = new DateTz(currentChunkStart)
          .set(0, 'hour')
          .set(0, 'minute')
          .stripSecMillis!();

        const dayTimestamp = currentDayStart.timestamp;

        const visualEvent: CalendarEventWithLayout = {
          ...event,
          start: currentChunkStart,
          end: chunkEnd,
          isContinuedBefore: currentChunkStart.timestamp > originalStart.timestamp,
          isContinuedAfter: chunkEnd.timestamp < originalEnd.timestamp,
          left: 0,
          width: 0
        };

        if (!eventsByDay.has(dayTimestamp)) {
          eventsByDay.set(dayTimestamp, []);
        }

        eventsByDay.get(dayTimestamp)!.push(visualEvent);

        currentChunkStart = startOfNextDay;
      }
    }

    for (const [dayTimestamp, dayEvents] of eventsByDay.entries()) {

      const sortedDayEvents = this.sortEventsStable(dayEvents);

      const groups = this.groupEventsByConflicts(sortedDayEvents);
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
          start: new DateTz(minStart),
          end: new DateTz(maxEnd),
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
