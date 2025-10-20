import { Color } from "../../../shared/types";
import { IDateTz } from "@open-rlb/date-tz";

export interface CalendarEvent {
	id?: string | number;
	title: string;
	start: IDateTz;
	end: IDateTz;
	color?: Color;
	allDay?: boolean;
	data?: any;
}