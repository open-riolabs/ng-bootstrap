import { ConnectedPosition } from '@angular/cdk/overlay';

/**
 * Below the field, falling back to above it when there is no room.
 *
 * Shared by `rlb-datepicker` and `rlb-date-range` so a form holding both does not have two
 * calendars that open in different directions.
 */
export const DATE_PICKER_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
];
