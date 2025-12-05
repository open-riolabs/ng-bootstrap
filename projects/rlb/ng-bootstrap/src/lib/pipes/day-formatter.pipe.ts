import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { IDateTz } from "@open-rlb/date-tz";

@Pipe({
  name: 'dayOfWeek',
  standalone: false
})
export class DayOfWeekPipe implements PipeTransform {

  /**
   * @param value IDateTz
   * @param format 'long' (Friday), 'short' (Fri), 'narrow' (F)
   * @param locale Language, default = 'en-US'
   */
  transform(value: IDateTz | null | undefined, format: 'long' | 'short' | 'narrow' = 'long', locale: string = 'en-US'): string {
    if (!value || typeof value.timestamp !== 'number') {
      return '';
    }

    let pattern = 'EEEE';
    if (format === 'short') pattern = 'EEE';
    if (format === 'narrow') pattern = 'EEEEE';

    try {
      return formatDate(
        value.timestamp,
        pattern,
        locale,
        value.timezone || undefined
      );
    } catch (error) {
      console.error('DayOfWeekPipe error:', error);
      return '';
    }
  }
}
