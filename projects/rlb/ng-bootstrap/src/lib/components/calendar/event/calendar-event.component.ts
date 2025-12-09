import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CalendarEvent, CalendarEventWithLayout } from "../interfaces/calendar-event.interface";

@Component({
  selector: 'rlb-calendar-event',
  templateUrl: 'calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  standalone: false,
})
export class CalendarEventComponent {
  @Input({ required: true }) event!: CalendarEventWithLayout;
  @Output() eventClick = new EventEmitter<CalendarEvent | undefined>();
  @Output() eventContainerClick = new EventEmitter<CalendarEventWithLayout[] | undefined>();

  get classes(): string[] {
    const baseColor = this.event.color || 'primary';
    const classes = ['calendar-event', 'shadow-sm'];

    if (this.event.isContinuedAfter) {
      classes.push('rounded-bottom-0', 'border-bottom-0');
    }

    if (this.event.isContinuedBefore) {
      classes.push('rounded-top-0', 'border-top-0', 'opacity-75');
    }


    if (this.event.isOverflowIndicator) {
      classes.push('overflow-indicator', 'bg-light', 'text-dark', 'border');
    } else {
      classes.push(`bg-${baseColor}`);
      if (['light', 'warning', 'white'].includes(baseColor)) {
        classes.push('text-dark');
      } else {
        classes.push('text-white');
      }
    }
    return classes;
  }

  onClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation()

    if (this.event.isOverflowIndicator && this.event.overflowEvents) {
      this.eventContainerClick.emit(this.event.overflowEvents)
    } else {
      this.eventClick.emit(this.event);
    }
  }
}
