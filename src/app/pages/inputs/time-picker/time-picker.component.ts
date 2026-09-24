import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateTz, IDateTz } from '@open-rlb/date-tz';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-time-picker-doc',
  templateUrl: './time-picker.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class TimePickerDocComponent {
  readonly zone = 'Europe/Rome';

  readonly time = signal<IDateTz | undefined>(undefined);
  readonly appointment = signal<IDateTz | undefined>(DateTz.now(this.zone));
  readonly twelveHour = signal<IDateTz | undefined>(undefined);

  readonly reactive = new FormControl<IDateTz | undefined>(undefined);

  basicExample = `<rlb-time-picker timezone="Europe/Rome" [(ngModel)]="time" />`;

  stepExample = `<!-- Quarter hours rather than every fifth minute. -->
<rlb-time-picker
  [minute-step]="15"
  timezone="Europe/Rome"
  [(ngModel)]="appointment"
/>`;

  formatExample = `<rlb-time-picker
  format="hh:mm AA"
  locale="en"
  timezone="America/New_York"
  [(ngModel)]="twelveHour"
/>`;

  reactiveExample = `readonly reactive = new FormControl<IDateTz | undefined>(undefined);

<rlb-time-picker [formControl]="reactive" timezone="Europe/Rome" />`;

  zoneExample = `// The value is a moment, not a wall-clock reading, so it keeps its day.
// Picking 09:00 in Europe/Rome in summer produces 07:00 UTC — which is why the
// time is built from local midnight plus minutes rather than with set(9, 'hour'):
// date-tz's set() works on the raw UTC timestamp and would land an hour out.`;

  api: DocApiRow[] = [
    { name: 'format', type: 'string', default: "'HH:mm'", description: 'How the box is written, and how what is typed into it is read back. Use hh:mm AA for a 12-hour clock.', kind: 'Input' },
    { name: 'locale', type: 'string', default: "'en'", description: 'Passed to date-tz for anything in the format that is a word.', kind: 'Input' },
    { name: 'timezone', type: 'string | undefined', default: 'RLB_DEFAULTS.date.timezone', description: 'Which zone the hour and minute are read and written in. Left out, the library-wide default set with provideRlbDefaults.', kind: 'Input' },
    { name: 'minute-step', type: 'number', default: '5', description: 'Minutes between the choices in the right-hand column.', kind: 'Input' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a button that empties the field.', kind: 'Input' },
    { name: 'openLabel / clearLabel / hoursLabel / minutesLabel', type: 'string', description: 'Names for the two icon buttons and the two lists, which carry no text of their own.', kind: 'Input' },
    { name: 'placeholder / name / size / readonly / disabled', type: 'string | boolean', description: 'As on every other input in the library.', kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Paints the Bootstrap is-valid / is-invalid state once the control has been touched.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'IDateTz | undefined', description: 'The day it already had, with the chosen hour and minute. A time with no date is almost never what a form means.', kind: 'Two-way' },
    { name: 'isOpen', type: 'Signal<boolean>', description: 'Whether the panel is showing.', kind: 'Input' },
    { name: 'open() / close() / toggle() / clear()', type: 'void', description: 'Drives the panel and the value from code.', kind: 'Method' },
    { name: 'pick(hour, minute)', type: 'void', description: 'Sets the time on the day already held, building it from local midnight so the zone offset is never applied twice.', kind: 'Method' },
  ];

  show(value: IDateTz | undefined | null): string {
    return value ? new DateTz(value).toString!('YYYY-MM-DD HH:mm tz') : '—';
  }
}
