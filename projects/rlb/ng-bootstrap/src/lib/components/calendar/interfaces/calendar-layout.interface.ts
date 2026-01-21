export interface CalendarLayout {
  rowHeight: number;       // px, default 110
  maxBodyHeight: number;   // rem, default 30
  minHeaderHeight: number; // rem, default 3.5
}

export const DEFAULT_CALENDAR_LAYOUT: CalendarLayout = {
  rowHeight: 110,
  maxBodyHeight: 30,
  minHeaderHeight: 3.5
};
