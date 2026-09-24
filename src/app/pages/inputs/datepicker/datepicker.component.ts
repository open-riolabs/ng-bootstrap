import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';
import { RlbDateRange } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class DatepickersComponent {
  readonly zone = 'Europe/Rome';

  readonly picked = signal<IDateTz | undefined>(undefined);
  readonly localised = signal<IDateTz | undefined>(undefined);
  readonly bounded = signal<IDateTz | undefined>(undefined);
  readonly range = signal<RlbDateRange | undefined>(undefined);

  readonly reactive = new FormControl<IDateTz | undefined>(undefined);

  readonly min = DateTz.now(this.zone);
  readonly max = DateTz.parse('2027-12-31', 'YYYY-MM-DD', this.zone);

  basicExample = `<rlb-datepicker
  timezone="Europe/Rome"
  [(ngModel)]="picked"
/>`;

  formatExample = `<!-- The box is written with format, and what is typed into it is read back the same way. -->
<rlb-datepicker
  format="DD LM YYYY"
  locale="it"
  [first-day-of-week]="1"
  timezone="Europe/Rome"
  [(ngModel)]="localised"
/>`;

  boundsExample = `<rlb-datepicker
  [min]="today"
  [max]="endOfNextYear"
  timezone="Europe/Rome"
  [(ngModel)]="bounded"
/>`;

  rangeExample = `<rlb-date-range
  timezone="Europe/Rome"
  separator=" → "
  [(ngModel)]="range"
/>`;

  reactiveExample = `readonly reactive = new FormControl<IDateTz | undefined>(undefined);

<rlb-datepicker [formControl]="reactive" timezone="Europe/Rome" />`;

  format(date: IDateTz | undefined): string {
    return date ? new DateTz(date).toString!('WL DD LM YYYY HH:mm tz', 'it') : '—';
  }

  datepickerApi: DocApiRow[] = [
    { name: 'ngModel / formControl', type: 'IDateTz | undefined', description: 'Local midnight of the chosen day, in this control timezone. A ControlValueAccessor like every other input here.', kind: 'Two-way' },
    { name: 'timezone', type: 'string | undefined', default: 'undefined', description: 'The zone the day belongs to. Left unset it comes from provideRlbDefaults({ date: { timezone } }), else UTC.', kind: 'Input' },
    { name: 'format', type: 'string', default: "'DD/MM/YYYY'", description: 'How the date is written in the box, and how what is typed there is read back. date-tz tokens.', kind: 'Input' },
    { name: 'locale', type: 'string', default: "'en'", description: 'Locale for month and weekday names.', kind: 'Input' },
    { name: 'first-day-of-week', type: 'number', default: '1', description: '0 is Sunday. Monday by default.', kind: 'Input' },
    { name: 'min', type: 'IDateTz | undefined', default: 'undefined', description: 'Earliest day that can be chosen. Earlier days are greyed out and a typed one is refused.', kind: 'Input' },
    { name: 'max', type: 'IDateTz | undefined', default: 'undefined', description: 'Latest day that can be chosen.', kind: 'Input' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a button that empties the value.', kind: 'Input' },
    { name: 'show-today', type: 'boolean', default: 'true', description: 'Shows the shortcut to today at the foot of the panel.', kind: 'Input' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Stops the box being typed into. The calendar button still opens.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", default: 'undefined', description: 'Bootstrap input-group sizing.', kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Applies Bootstrap is-valid / is-invalid from the form-control state.', kind: 'Input' },
    { name: 'openLabel / clearLabel / todayLabel', type: 'string', description: 'Accessible names and the today shortcut. English defaults.', kind: 'Input' },
  ];

  rangeApi: DocApiRow[] = [
    { name: 'ngModel / formControl', type: 'RlbDateRange | undefined', description: '{ start?: IDateTz; end?: IDateTz }. The first click sets the start, the second the end.', kind: 'Two-way' },
    { name: 'separator', type: 'string', default: "' – '", description: 'What goes between the two dates in the box.', kind: 'Input' },
    { name: 'format / locale / timezone / first-day-of-week / min / max / clearable / size / disabled', type: '—', description: 'The same as rlb-datepicker.', kind: 'Input' },
  ];
}
