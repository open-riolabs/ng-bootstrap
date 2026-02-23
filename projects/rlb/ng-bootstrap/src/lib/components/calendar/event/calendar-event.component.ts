import { Component, computed, input, output } from "@angular/core";
import { CalendarEvent, CalendarEventWithLayout } from "../interfaces/calendar-event.interface";
import { CalendarView } from "../interfaces/calendar-view.type";

@Component({
  selector: 'rlb-calendar-event',
  templateUrl: 'calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  standalone: false,
})
export class CalendarEventComponent {
  event = input.required<CalendarEventWithLayout>();
  view = input.required<CalendarView>();
  eventClick = output<CalendarEvent | undefined>();
  eventContainerClick = output<CalendarEventWithLayout[] | undefined>();

  classes = computed(() => {
    const event = this.event();
    const view = this.view();
    const baseColor = event.color || 'primary';
    const classes = ['calendar-event', 'shadow-sm'];

    switch (view) {
      case 'week':
        classes.push('mode-week');
        break;
      case 'month':
        classes.push('mode-month');
        break;
    }

    if (event.isContinuedAfter) {
      classes.push('rounded-bottom-0', 'border-bottom-0');
    }

    if (event.isContinuedBefore) {
      classes.push('rounded-top-0', 'border-top-0', 'opacity-75');
    }


    if (event.isOverflowIndicator) {
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
  });

  onClick(e: Event) {
    const event = this.event();
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (event.isOverflowIndicator && event.overflowEvents) {
      this.eventContainerClick.emit(event.overflowEvents);
    } else {
      this.eventClick.emit(event);
    }
  }
}
