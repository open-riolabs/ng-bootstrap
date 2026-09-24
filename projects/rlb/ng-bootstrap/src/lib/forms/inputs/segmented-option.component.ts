import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * One choice of an `rlb-segmented`.
 *
 * It renders nothing of its own: the group draws the buttons, because only the group can give them
 * a single tab stop and arrow-key movement. This declares what exists.
 */
@Component({
  selector: 'rlb-segmented-option',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedOptionComponent {
  /** What this choice is worth. Compared by identity, so an object works as well as a string. */
  value = input<unknown>(undefined);
  label = input<string | undefined>(undefined);
  icon = input<string | undefined>(undefined);
  disabled = input(false, { transform: booleanAttribute });
}
