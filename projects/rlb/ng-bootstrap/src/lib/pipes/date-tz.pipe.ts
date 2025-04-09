import { Pipe, PipeTransform } from '@angular/core';
import { DateTz, IDateTz } from '../shared/i-date-tz';

@Pipe({
  name: 'dtz',
  standalone: false
})
export class DateTzPipe implements PipeTransform {

  transform(value?: IDateTz, ...args: (string | boolean)[]): string {
    const format = args[0] as string || 'YYYY-MM-DDTHH:mm';
    const tz = args[1] as boolean || false;
    if (value) {
      value = new DateTz(value);
    }
    if (!value) return '';
    return `${value.toString?.(format) || ''}${tz ? ' (' + value.timezone + ')' : ''}`;
  }
}
