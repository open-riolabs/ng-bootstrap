import { Color } from "../../../shared/types";

export interface CalendarInterval {
  dayWeek: number;      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hourStart?: number;   // Seconds from midnight (0-86400). Defaults to 0.
  hourStop?: number;    // Seconds from midnight (0-86400). Defaults to 86400 (end of day).
  color?: Color;        // Bootstrap color, defaults to 'success'
  label?: string;
}
