import { Color } from "../../../shared/types";
import { IDateTz } from "@open-rlb/date-tz";

export interface CalendarEvent<T = any> {
  id: string | number;
	title: string;
	start: IDateTz;
	end: IDateTz;
	color?: Color;
	allDay?: boolean;
	/**
	 * Evento di sola lettura: il click emette comunque `event-click`, ma il
	 * calendario non apre il modal di modifica (il cui «Cancel» elimina
	 * l'evento), non lo lascia trascinare e non offre modifica/eliminazione
	 * nel modal degli eventi in overflow.
	 */
	readonly?: boolean;
	data?: T;
}

export interface CalendarEventWithLayout extends CalendarEvent {
  // Horizontal margin in percent (0, 33.3, 50, etc)
  left: number;
  // Width percent (100, 50, 33.3, etc.)
  width: number;
  // isEventContainer flag
  isOverflowIndicator?: boolean;
  isContinuedBefore?: boolean;
  isContinuedAfter?: boolean
  overflowEvents?: CalendarEventWithLayout[];
  overlapCount?: number;
}
