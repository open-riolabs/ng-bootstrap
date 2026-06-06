import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
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
} from '@angular/core';
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { DateTzPipe } from '../../../../pipes/date-tz.pipe';
import { DayOfWeekPipe } from '../../../../pipes/day-formatter.pipe';
import { CalendarEventComponent } from '../../event/calendar-event.component';
import { CalendarEvent, CalendarEventWithLayout } from "../../interfaces/calendar-event.interface";
import { CalendarInterval } from "../../interfaces/calendar-interval.interface";
import { CalendarLayout } from "../../interfaces/calendar-layout.interface";
import { CalendarView } from "../../interfaces/calendar-view.type";
import { dayAt, isToday, minutesSinceMidnight, startOfDayTs } from "../../utils/calendar-date-utils";


// Extend the layout interface for internal rendering logic
interface MonthViewEvent extends CalendarEventWithLayout {
  isSpacer?: boolean; // Invisible block to maintain vertical rhythm
  isHidden?: boolean; // Flag for logic (though we mostly slice array)
  originalStart: IDateTz; // Needed for DnD calculations
  originalEnd: IDateTz;
}

interface DaySlot {
  date: IDateTz;
  events: MonthViewEvent[];
  hasOverflow: boolean;
  overflowCount: number;
  overflowEvents: CalendarEvent[];
}

const MAX_EVENTS_PER_CELL = 3;
const DAYS_IN_GRID = 42; // 6 weeks * 7 days

@Component({
  selector: 'rlb-calendar-month-grid',
  templateUrl: './calendar-month-grid.component.html',
  styleUrls: ['./calendar-month-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropListGroup, CdkDropList, CalendarEventComponent, CdkDrag, CdkDragPlaceholder, CdkDragPreview, DateTzPipe, DayOfWeekPipe]
})
export class CalendarMonthGridComponent implements AfterViewInit, OnDestroy {

  view = input.required<CalendarView>();
  currentDate = input.required<IDateTz>();
  events = input<CalendarEvent[]>([]);
  intervals = input<CalendarInterval[]>([]);
  timezone = input.required<string>();
  layout = input.required<CalendarLayout>();


  eventClick = output<CalendarEvent | undefined>({ alias: 'event-click' });
  eventContainerClick = output<CalendarEvent[] | undefined>({ alias: 'event-container-click' });
  eventChange = output<CalendarEvent>({ alias: 'event-change' });

  scrollBodyRef = viewChild<ElementRef<HTMLDivElement>>('scrollBody');
  headerRowRef = viewChild<ElementRef<HTMLDivElement>>('headerRow');

  scrollbarWidth = signal(0);

  weeks = signal<DaySlot[][]>([]);
  weekDaysHeader = signal<IDateTz[]>([]);

  constructor() {
    effect(() => {
      // Accessing signals to register dependency
      this.currentDate();
      this.view();
      this.events();
      this.buildMonthGrid();
    });
  }


  ngAfterViewInit() {
    this.updateScrollbarWidth();
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize = () => {
    this.updateScrollbarWidth();
  };

  onBodyScroll(event: Event) {
    const headerRow = this.headerRowRef();
    const scrollBody = this.scrollBodyRef();
    if (headerRow && scrollBody) {
      headerRow.nativeElement.scrollLeft = scrollBody.nativeElement.scrollLeft;
    }
  }

  private updateScrollbarWidth() {
    const scrollBody = this.scrollBodyRef();
    if (scrollBody) {
      const el = scrollBody.nativeElement;
      this.scrollbarWidth.set(el.offsetWidth - el.clientWidth);
    }
  }


  // --- Helpers ---

  isToday(date: IDateTz): boolean {
    return isToday(date, this.timezone());
  }

  hasInterval(date: IDateTz): boolean {
    const dayOfWeek = new DateTz(date).dayOfWeek as number;
    return this.intervals().some(interval => interval.dayWeek === dayOfWeek);
  }

  getIntervalColor(date: IDateTz): string {
    const dayOfWeek = new DateTz(date).dayOfWeek as number;
    const interval = this.intervals().find(i => i.dayWeek === dayOfWeek);
    return interval ? `var(--bs-${interval.color || 'success'})` : '';
  }

  isCurrentMonth(date: IDateTz): boolean {
    return date.month === this.currentDate().month;
  }

  trackByDay(_index: number, item: DaySlot): number {
    return item.date.timestamp;
  }

  trackByEvent(index: number, item: MonthViewEvent): string | number {
    // Unique ID for spacers is crucial for Angular rendering performance
    return item.id || `spacer-${index}`;
  }

  // --- Core Logic ---

  private buildMonthGrid() {
    const tz = this.timezone();
    // 1. Calculate Grid Boundaries (tz-aware; set()/add() would be UTC-naive)
    const current = this.currentDate().cloneToTimezone!(tz);
    // First day of the month at local midnight
    const firstOfMonth = dayAt(current, tz, -(current.day! - 1));

    // Calculate offset to find the start of the grid (Monday-first)
    const dayOfWeek = firstOfMonth.dayOfWeek as number; // 0 = Sun, 1 = Mon...
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // 2. Generate Days
    const days: IDateTz[] = [];
    for (let i = 0; i < DAYS_IN_GRID; i++) {
      days.push(dayAt(firstOfMonth, tz, i - offset));
    }

    // Header is just the first week
    this.weekDaysHeader.set(days.slice(0, 7));

    // 3. Process Events (Slotting Algorithm)
    const slotsMap = this.calculateEventSlots(days, this.events());

    // 4. Build View Model (Weeks & Overflow logic)
    const newWeeks: DaySlot[][] = [];
    for (let i = 0; i < DAYS_IN_GRID; i += 7) {
      const weekDays = days.slice(i, i + 7);

      const row: DaySlot[] = weekDays.map(day => {
        const slots = slotsMap.get(day.timestamp) || [];
        const totalSlots = slots.length;

        let visibleEvents: MonthViewEvent[];
        let overflowEvents: CalendarEvent[] = [];
        let hasOverflow = false;

        if (totalSlots > MAX_EVENTS_PER_CELL) {
          hasOverflow = true;
          // Leave room for the "+ More" button
          const cutOffIndex = MAX_EVENTS_PER_CELL - 1;
          visibleEvents = slots.slice(0, cutOffIndex);

          // Collect all *real* events that are hidden (excluding spacers)
          // We start looking from cutOffIndex to the end
          for (let k = cutOffIndex; k < totalSlots; k++) {
            const ev = slots[k];
            // We only care about real events for the popup/modal
            if (ev && !ev.isSpacer) {
              overflowEvents.push(ev);
            }
          }
        } else {
          visibleEvents = slots;
        }

        return {
          date: day,
          events: visibleEvents,
          hasOverflow,
          overflowCount: overflowEvents.length,
          overflowEvents: overflowEvents
        };
      });

      newWeeks.push(row);
    }

    this.weeks.set(newWeeks);

    // Defer scrollbar calculation to after the view updates
    setTimeout(() => {
      this.updateScrollbarWidth();
    });
  }

  /**
   * "Tetris" Algorithm:
   * Places events into rows so that long events maintain their vertical position across days.
   */
  private calculateEventSlots(days: IDateTz[], events: CalendarEvent[]): Map<number, MonthViewEvent[]> {
    const tz = this.timezone();
    const dayMap = new Map<number, MonthViewEvent[]>();
    days.forEach(d => dayMap.set(d.timestamp, []));

    // Sort: Longest events first, then by start time
    const sortedEvents = [...events].sort((a, b) => {
      const durA = a.end.timestamp - a.start.timestamp;
      const durB = b.end.timestamp - b.start.timestamp;
      if (durB !== durA) return durB - durA;
      return a.start.timestamp - b.start.timestamp;
    });

    const gridStartTs = days[0].timestamp;
    const lastDay = days[days.length - 1];
    // End of grid is the start of the next day after the last cell
    const gridEndTs = dayAt(lastDay, tz, 1).timestamp;

    for (const event of sortedEvents) {
      // tz-aware day-floors (set()/add() would be UTC-naive).
      const evtStartTs = startOfDayTs(event.start, tz);

      // Normalize end. If it ends exactly at local 00:00, it visually ends on the
      // previous day; otherwise round up to the start of the next day.
      const endsAtMidnight = minutesSinceMidnight(event.end, tz) === 0;
      const evtEndTs = (event.end.timestamp > evtStartTs && endsAtMidnight)
        ? startOfDayTs(event.end, tz)
        : dayAt(event.end, tz, 1).timestamp;

      // Skip if completely outside grid
      if (evtEndTs <= gridStartTs || evtStartTs >= gridEndTs) {
        continue;
      }

      // Find which grid indices this event occupies
      const daysIndices: number[] = [];
      for (let i = 0; i < days.length; i++) {
        const dTs = days[i].timestamp;
        // Check intersection: [DayStart, DayEnd) overlaps [EventStart, EventEnd)
        if (dTs >= evtStartTs && dTs < evtEndTs) {
          daysIndices.push(i);
        }
      }

      if (daysIndices.length === 0) continue;

      // Find the first available row index (visual height) common to ALL occupied days
      let rowIndex = 0;
      let available = false;

      while (!available) {
        let collision = false;
        for (const idx of daysIndices) {
          const dTs = days[idx].timestamp;
          const slots = dayMap.get(dTs)!;
          // Check if slot is occupied
          if (slots[rowIndex] !== undefined) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          available = true;
        } else {
          rowIndex++;
        }
      }

      // Place the event segments
      daysIndices.forEach((idx, i) => {
        const dTs = days[idx].timestamp;
        const slots = dayMap.get(dTs)!;

        // Fill gaps with spacers up to rowIndex
        while (slots.length < rowIndex) {
          slots.push({ isSpacer: true, id: -1 } as MonthViewEvent);
        }

        const isFirstRenderDay = (i === 0);
        const isLastRenderDay = (i === daysIndices.length - 1);

        // `dayInTz` is the grid cell, already in the calendar timezone.
        const dayInTz = days[idx];
        const currentDayEnd = dayAt(dayInTz, tz, 1);

        // Visual flags for rounding corners
        const isContinuedBefore = !isFirstRenderDay || (evtStartTs < days[daysIndices[0]].timestamp);
        const isContinuedAfter = !isLastRenderDay || (evtEndTs > currentDayEnd.timestamp);

        const eventView: MonthViewEvent = {
          ...event,
          // Override start/end for the specific cell (crucial for DnD to know the cell context)
          start: new DateTz(dayInTz),
          end: new DateTz(currentDayEnd),
          originalStart: event.start,
          originalEnd: event.end,
          isContinuedBefore,
          isContinuedAfter,
          left: 0,
          width: 100
        };

        slots[rowIndex] = eventView;
      });
    }

    return dayMap;
  }

  // --- Drag and Drop ---

  onEventDrop(event: CdkDragDrop<IDateTz, any, MonthViewEvent>) {
    const movedSegment = event.item.data;
    const targetDate = event.container.data;

    // Calculate time difference
    const diffMs = targetDate.timestamp - movedSegment.start.timestamp;

    // Use original dates to prevent shifting due to segmentation
    const sourceStart = movedSegment.originalStart;
    const sourceEnd = movedSegment.originalEnd;

    // Create new dates
    const newStartTs = sourceStart.timestamp + diffMs;
    const newEndTs = sourceEnd.timestamp + diffMs;

    // Create clean object (Immutability pattern)
    // Destructure to remove layout specific props like isSpacer, originalStart, etc.
    const { isSpacer, isHidden, isContinuedBefore, isContinuedAfter, originalStart, originalEnd, left, width, ...baseEvent } = movedSegment;

    const updatedEvent: CalendarEvent = {
      ...baseEvent,
      start: new DateTz(newStartTs, sourceStart.timezone).stripSecMillis(),
      end: new DateTz(newEndTs, sourceEnd.timezone).stripSecMillis()
    };

    this.eventChange.emit(updatedEvent);
  }
}
