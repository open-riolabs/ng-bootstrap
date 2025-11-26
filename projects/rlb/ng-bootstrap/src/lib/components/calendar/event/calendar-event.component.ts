import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CalendarEvent, CalendarEventWithLayout } from "../interfaces/calendar-event.interface";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { isSameDay } from "../utils/calendar-date-utils";

@Component({
  selector: 'rlb-calendar-event',
  templateUrl: 'calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  standalone: false,
})
export class CalendarEventComponent {
  @Input({required: true}) event!:  CalendarEventWithLayout
  @Input({required: true}) time!:  string
  @Input({required: true}) day!:  IDateTz
  @Input({required: true}) rowHeight!:  number

  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEventWithLayout[] | undefined>();

  constructor() {
  }

  onEventEdit(event?: CalendarEventWithLayout): void {
    this.eventClick.emit(event);
  }

  onOverflowIndicatorClick(indicator: CalendarEventWithLayout): void {
    if (indicator.isOverflowIndicator && indicator.overflowEvents) {
      this.eventContainerClick.emit(indicator.overflowEvents);
    }
  }


  calculateEventTop(event: CalendarEvent, time: string, day: IDateTz): number {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    const startOfCurrentHour = new DateTz(day.timestamp, 'UTC')
      .set(hour, 'hour')
      .set(0, 'minute')

    const eventStart = event.start;
    const effectiveStartTimestamp = Math.max(eventStart.timestamp, startOfCurrentHour.timestamp);
    const diffMs = effectiveStartTimestamp - startOfCurrentHour.timestamp;
    const diffMinutes = diffMs / (1000 * 60);

    return (diffMinutes / 60) * this.rowHeight;
  }

  isEventStartInHour(event: CalendarEventWithLayout, time: string, day: IDateTz): boolean {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    const startOfHour = new DateTz(day.timestamp, 'UTC')
      .set(hour, 'hour')
      .set(0, 'minute')

    const endOfHour = new DateTz(startOfHour.timestamp, 'UTC').add(1, 'hour');

    const eventStart = event.start;

    const startsAfterOrAtStart = eventStart.compare!(startOfHour) >= 0;
    const startsBeforeEnd = eventStart.compare!(endOfHour) < 0;

    const startsOnCurrentDay = isSameDay(event.start, day);

    return startsOnCurrentDay && startsAfterOrAtStart && startsBeforeEnd;
  }

  calculateEventHeightInHour(event: CalendarEvent, time: string, day: IDateTz): number {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);

    const startOfCurrentHour = new DateTz(day.timestamp, 'UTC')
      .set(hour, 'hour')
      .set(0, 'minute')

    const endOfCurrentHour = new DateTz(startOfCurrentHour.timestamp, 'UTC').add(1, 'hour');

    const eventStart = event.start;
    const eventEnd = event.end;

    const effectiveStartTimestamp = Math.max(eventStart.timestamp, startOfCurrentHour.timestamp);

    const effectiveEndTimestamp = Math.min(eventEnd.timestamp, endOfCurrentHour.timestamp);

    const durationMs = effectiveEndTimestamp - effectiveStartTimestamp;

    if (durationMs <= 0) return 0;

    const durationMinutes = durationMs / (1000 * 60);

    return (durationMinutes / 60) * this.rowHeight;
  }

  isEventFragmentTop(event: CalendarEventWithLayout, time: string, day: IDateTz): boolean {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const startOfHour = new DateTz(day.timestamp, 'UTC').set(hour, 'hour').set(0, 'minute');

    const isStartInOrAfterHour = event.start.compare!(startOfHour) >= 0;
    const isContinuation = event.start.compare!(startOfHour) < 0;
    const isDayStartContinuation = isContinuation && hour === 0;

    return isStartInOrAfterHour || isDayStartContinuation;
  }

  isEventFragmentBottom(event: CalendarEventWithLayout, time: string, day: IDateTz): boolean {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const endOfHour = new DateTz(day.timestamp, 'UTC').set(hour + 1, 'hour').set(0, 'minute');

    const isEndInHour = event.end.compare!(endOfHour) <= 0;
    const isEndFragmentOfDay = hour === 23 && event.end.compare!(endOfHour) > 0;

    return isEndInHour || isEndFragmentOfDay;
  }

  getEventClasses(event: CalendarEventWithLayout, time: string, day: IDateTz): string[] {
    const eventClasses: string[] = [];
    eventClasses.push('border-light')

    const eventColorClass = `bg-${event.color ? event.color : ''}`;
    eventClasses.push(eventColorClass);

    if (this.isEventFragmentTop(event, time, day)) {
      eventClasses.push('event-fragment-top')
    }

    if (this.isEventFragmentBottom(event, time, day)) {
      eventClasses.push('event-fragment-bottom')
    }

    if (!this.isEventFragmentTop(event, time, day) && !this.isEventFragmentBottom(event, time, day)) {
      eventClasses.push('event-fragment-middle')
    }

    return eventClasses
  }
}
