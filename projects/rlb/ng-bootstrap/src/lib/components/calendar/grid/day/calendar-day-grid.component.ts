import { CdkDragDrop } from "@angular/cdk/drag-drop";
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
import { DateTz } from "@open-rlb/date-tz/date-tz";
import { CalendarEvent, CalendarEventWithLayout } from "../../interfaces/calendar-event.interface";
import { CalendarLayout } from "../../interfaces/calendar-layout.interface";
import { CalendarView } from "../../interfaces/calendar-view.type";
import { getToday, isToday } from "../../utils/calendar-date-utils";



@Component({
  selector: 'rlb-calendar-day-grid',
  templateUrl: './calendar-day-grid.component.html',
  styleUrls: ['./calendar-day-grid.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarDayGridComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() view!: CalendarView;
  @Input() currentDate!: IDateTz;
  @Input() events: CalendarEvent[] = [];
  @Input() layout!: CalendarLayout;
  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();

  @Output() eventContainerClick = new EventEmitter<CalendarEvent[] | undefined>();
  @Output() eventChange = new EventEmitter<CalendarEvent>();

  day!: IDateTz;
  timeSlots: string[] = [];
  processedEvents: CalendarEventWithLayout[] = [];

  @ViewChild('scrollBody', { static: false }) scrollBodyRef!: ElementRef<HTMLDivElement>;

  now: DateTz;
  private nowInterval: any;

  // CONFIG CONSTANTS (Replaced by Layout Input)
  private readonly MAX_VISIBLE_COLUMNS = 10; // More columns allow in day view
  private readonly SNAP_MINUTES = 15;



  constructor(
    private cd: ChangeDetectorRef,
  ) {
    this.now = getToday();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['view'] || changes['currentDate']) {
      if (this.view === 'day') {
        this.buildDayGrid(this.currentDate);
        this.buildTimeSlots();
      }
    }

    if (changes['events']) {
      this.events = changes['events'].currentValue as CalendarEvent[];
    }

    if (changes['events'] || changes['currentDate']) {
      this.processAllEvents();
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.stopNowTimer();
  }

  trackByEventId(index: number, item: CalendarEventWithLayout): string | number {
    return item.id;
  }

  onEventDrop(event: CdkDragDrop<IDateTz, any, CalendarEventWithLayout>) {
    const movedEvent = event.item.data as CalendarEventWithLayout;
    // For day view, the container data is the single day we are viewing
    const newDay = this.day;

    const originalTopPx = this.calculateEventTop(movedEvent);
    const dragDistancePx = event.distance.y;
    const newTopPx = originalTopPx + dragDistancePx;

    const rawMinutesFromStart = (newTopPx / this.layout.rowHeight) * 60;
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

  calculateEventTop(event: CalendarEventWithLayout): number {
    const startOfDay = new DateTz(this.day).set(0, 'hour').set(0, 'minute').stripSecMillis();
    // Use event.start directly, but ensure we are calculating relative to THIS day
    // If event starts on previous day, we should clamp?
    // Logic from week grid handles "chunks", here we assume processAllEvents has given us the chunk for this day.

    let eventStart = event.start;
    if (eventStart.timestamp < startOfDay.timestamp) {
      eventStart = startOfDay;
    }

    const diffMs = eventStart.timestamp - startOfDay.timestamp;
    const diffMinutes = diffMs / (1000 * 60);
    return (diffMinutes / 60) * this.layout.rowHeight;
  }


  calculateEventHeight(event: CalendarEventWithLayout): number {
    // If event continues to next day, visual end is midnight.
    // Logic from week grid's 'processAllEvents' handled chunking, so here specific event chunk should be correct.
    const durationMs = event.end.timestamp - event.start.timestamp;
    const durationMinutes = durationMs / (1000 * 60);
    return (durationMinutes / 60) * this.layout.rowHeight;
  }


  getNowTop(): number {
    const hours = this.now.hour;
    const minutes = this.now.minute;
    return ((hours * 60) + minutes) / 60 * this.layout.rowHeight;
  }


  isToday(date: IDateTz): boolean {
    return isToday(date);
  }

  private startNowTimer() {
    this.stopNowTimer(); // clear existing if any
    this.nowInterval = setInterval(() => {
      this.now = getToday();
      this.cd.detectChanges();
    }, 60 * 1000); // every minute
  }

  private stopNowTimer() {
    if (this.nowInterval) {
      clearInterval(this.nowInterval);
    }
  }

  private buildDayGrid(currentDate: IDateTz) {
    this.day = new DateTz(currentDate.timestamp, 'UTC');
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
    if (!this.day) return;

    // Filter events for this day
    const dayStart = new DateTz(this.day).set(0, 'hour').set(0, 'minute').stripSecMillis!();
    const dayEnd = new DateTz(this.day).set(0, 'hour').set(0, 'minute').add(1, 'day').stripSecMillis!();

    const dayEvents: CalendarEventWithLayout[] = [];

    for (const event of this.events) {
      // Check overlap with the day
      if (event.end.timestamp > dayStart.timestamp && event.start.timestamp < dayEnd.timestamp) {

        let visualStart = event.start;
        let visualEnd = event.end;
        let isContinuedBefore = false;
        let isContinuedAfter = false;

        if (visualStart.timestamp < dayStart.timestamp) {
          visualStart = dayStart;
          isContinuedBefore = true;
        }
        if (visualEnd.timestamp > dayEnd.timestamp) {
          visualEnd = dayEnd;
          isContinuedAfter = true;
        }

        dayEvents.push({
          ...event,
          start: visualStart,
          end: visualEnd,
          isContinuedBefore,
          isContinuedAfter,
          left: 0,
          width: 0
        });
      }
    }

    const sortedDayEvents = this.sortEventsStable(dayEvents);
    const groups = this.groupEventsByConflicts(sortedDayEvents);
    const eventsWithLayout: CalendarEventWithLayout[] = [];

    for (const group of groups) {
      const groupLayouts = this.resolveConflictGroupLayout(group);
      eventsWithLayout.push(...groupLayouts);
    }

    this.processedEvents = eventsWithLayout;
    this.cd.markForCheck();
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

    // All events share the width equally
    // If needed we can expand visible max columns, but day view usually has space
    const colWidth = 100 / Math.max(1, totalColumns);

    columns.forEach((colEvents, colIndex) => {
      colEvents.forEach(event => {
        resultEvents.push({
          ...event,
          left: colIndex * colWidth,
          width: colWidth
        });
      });
    });

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
