import { Component, input, output } from "@angular/core";
import { DateTz, IDateTz } from "@open-rlb/date-tz";
import { CalendarView } from "../interfaces/calendar-view.type";
import { addDays, getToday } from "../utils/calendar-date-utils";

@Component({
  selector: 'rlb-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  standalone: false
})
export class CalendarHeaderComponent {
  view = input<CalendarView>('month');
  currentDate = input.required<IDateTz>();
  dateChange = output<DateTz>();
  viewChange = output<CalendarView>();

  next() {
    switch (this.view()) {
      case 'week':
        const nextWeek = addDays(this.currentDate(), 7);
        this.dateChange.emit(new DateTz(nextWeek));
        break;
      case 'month':
        const nextMonth = new DateTz(this.currentDate())
          .set(1, 'day')
          .add(1, 'month');
        this.dateChange.emit(new DateTz(nextMonth));
        break;
      case 'day':
        const nextDay = addDays(this.currentDate(), 1);
        this.dateChange.emit(new DateTz(nextDay));
        break;
      default:
        break;
    }
  }

  prev() {
    switch (this.view()) {
      case 'week':
        const pastWeek = addDays(this.currentDate(), -7);
        this.dateChange.emit(new DateTz(pastWeek));
        break;
      case 'month':
        const pastMonth = new DateTz(this.currentDate())
          .set(1, 'day')
          .add(-1, 'month');
        this.dateChange.emit(new DateTz(pastMonth));
        break;
      case 'day':
        const nextDay = addDays(this.currentDate(), -1);
        this.dateChange.emit(new DateTz(nextDay));
        break;
      default:

        break;
    }
  }

  today() {
    switch (this.view()) {
      case 'week':
      default:
        const today = getToday();
        this.dateChange.emit(today);
        break;
    }
  }

  setView(view: CalendarView) {
    this.viewChange.emit(view);
  }
}
