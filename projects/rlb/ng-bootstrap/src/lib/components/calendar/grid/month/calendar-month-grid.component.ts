import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarEvent, CalendarEventWithLayout } from "../../interfaces/calendar-event.interface";
import { CalendarView } from "../../interfaces/calendar-view.type";
import { isToday } from "../../utils/calendar-date-utils";

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

const MAX_EVENTS_PER_CELL = 4;
const DAYS_IN_GRID = 42; // 6 weeks * 7 days

@Component({
  selector: 'rlb-calendar-month-grid',
  templateUrl: './calendar-month-grid.component.html',
  styleUrls: ['./calendar-month-grid.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMonthGridComponent implements OnChanges {

  @Input() view!: CalendarView;
  @Input() currentDate!: IDateTz;
  @Input() events: CalendarEvent[] = [];

  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEvent[] | undefined>();
  @Output() eventChange = new EventEmitter<CalendarEvent>();

  weeks: DaySlot[][] = [];
  weekDaysHeader: IDateTz[] = [];
  maxBodyHeight: number = 30; // rem


  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentDate'] || changes['view'] || changes['events']) {
      this.buildMonthGrid();
    }
  }

  // --- Helpers ---

  isToday(date: IDateTz): boolean {
    return isToday(date);
  }

  isCurrentMonth(date: IDateTz): boolean {
    return date.month === this.currentDate.month;
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
    // 1. Calculate Grid Boundaries
    const current = new DateTz(this.currentDate);
    // Find the first day of the month
    const startOfMonth = new DateTz(current).set(1, 'day').set(0, 'hour').set(0, 'minute').stripSecMillis();

    // Calculate offset to find the start of the grid (e.g. Monday)
    const dayOfWeek = startOfMonth.dayOfWeek as number; // 0 = Sun, 1 = Mon...
    // Adjust logic based on your locale start of week (assuming Monday start here)
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const gridStart = new DateTz(startOfMonth).add(-offset, 'day');

    // 2. Generate Days
    const days: IDateTz[] = [];
    let iter: IDateTz = new DateTz(gridStart);

    for (let i = 0; i < DAYS_IN_GRID; i++) {
      days.push(iter);
      iter = new DateTz(iter).add(1, 'day');
    }

    // Header is just the first week
    this.weekDaysHeader = days.slice(0, 7);

    // 3. Process Events (Slotting Algorithm)
    const slotsMap = this.calculateEventSlots(days, this.events);

    // 4. Build View Model (Weeks & Overflow logic)
    this.weeks = [];
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

      this.weeks.push(row);
    }
  }

  /**
   * "Tetris" Algorithm:
   * Places events into rows so that long events maintain their vertical position across days.
   */
  private calculateEventSlots(days: IDateTz[], events: CalendarEvent[]): Map<number, MonthViewEvent[]> {
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
    const gridEndTs = new DateTz(lastDay).add(1, 'day').timestamp;

    for (const event of sortedEvents) {
      // Normalize start to beginning of day
      const evtStart = new DateTz(event.start).set(0, 'hour').set(0, 'minute').stripSecMillis();
      const evtEndRaw = new DateTz(event.end).stripSecMillis();

      // Normalize end.
      // If ends at 00:00, it effectively ends at the previous day visually.
      // Else, round up to the end of that day.
      let evtEnd: IDateTz;
      const isMidnight = evtEndRaw.hour === 0 && evtEndRaw.minute === 0;

      if (evtEndRaw.timestamp > evtStart.timestamp && isMidnight) {
        evtEnd = evtEndRaw; // Keeps it clean for comparison, effectively 00:00 of next day
      } else {
        // Round to start of next day to cover full day
        evtEnd = new DateTz(evtEndRaw).set(0, 'hour').set(0, 'minute').add(1, 'day').stripSecMillis!();
      }

      // Skip if completely outside grid
      if (evtEnd.timestamp <= gridStartTs || evtStart.timestamp >= gridEndTs) {
        continue;
      }

      // Find which grid indices this event occupies
      const daysIndices: number[] = [];
      for (let i = 0; i < days.length; i++) {
        const dTs = days[i].timestamp;
        // Check intersection: [DayStart, DayEnd) overlaps [EventStart, EventEnd)
        if (dTs >= evtStart.timestamp && dTs < evtEnd.timestamp) {
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

        // Visual flags for rounding corners
        const isContinuedBefore = !isFirstRenderDay || (evtStart.timestamp < days[daysIndices[0]].timestamp);
        const currentDayEndTs = new DateTz(dTs).add(1, 'day').timestamp;
        const isContinuedAfter = !isLastRenderDay || (evtEnd.timestamp > currentDayEndTs);

        const eventView: MonthViewEvent = {
          ...event,
          // Override start/end for the specific cell (crucial for DnD to know the cell context)
          start: new DateTz(dTs),
          end: new DateTz(currentDayEndTs),
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
      start: new DateTz(newStartTs, sourceStart.timezone),
      end: new DateTz(newEndTs, sourceEnd.timezone)
    };

    this.eventChange.emit(updatedEvent);
  }
}
