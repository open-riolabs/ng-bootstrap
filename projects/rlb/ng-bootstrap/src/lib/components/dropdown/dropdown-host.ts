import { Signal } from '@angular/core';
import { VisibilityEventBase } from '../../shared/types';

/** How far a dropdown goes before it closes itself. */
export type RlbDropdownAutoClose = 'default' | 'inside' | 'outside' | 'manual';

/** Which side of the toggle the menu opens on. */
export type RlbDropdownDirection = 'up' | 'down' | 'left' | 'right' | 'up-center' | 'down-center';

/** Which edge of the toggle the menu lines its own up with. */
export type RlbDropdownAlign = 'start' | 'end' | 'center';

/** What the menu hangs from: the toggle itself, or the box around it. */
export type RlbDropdownAnchor = 'self' | 'parent';

/** What the toggle hands the host when it registers itself. */
export interface RlbDropdownToggle {
  readonly element: HTMLElement;
  readonly offset: Signal<number[]>;
  readonly autoClose: Signal<RlbDropdownAutoClose>;
  readonly anchor?: Signal<RlbDropdownAnchor>;
  emitStatus(event: VisibilityEventBase): void;
}

/**
 * What a toggle and a menu can say to whatever is coordinating them.
 *
 * An abstract class rather than an interface so it can be an injection token, and injected
 * `{ optional: true }` by children that may also be used on their own — the same shape as
 * `DataTableHost` and `RlbStepperHost`. It keeps the toggle, the menu and the coordinator from
 * importing each other in a circle.
 */
export abstract class RlbDropdownHost {
  abstract readonly isOpen: Signal<boolean>;

  abstract registerToggle(toggle: RlbDropdownToggle): void;
  abstract registerMenu(element: HTMLElement, align: Signal<RlbDropdownAlign>): void;

  /** `focusFirst` is for opening from the keyboard, where the first item should take focus. */
  abstract open(focusFirst?: boolean): void;
  /** `returnFocus` puts focus back on the toggle, which is what Escape and Tab want. */
  abstract close(returnFocus?: boolean): void;
  abstract toggle(): void;

  /** Keys pressed while the toggle has focus and the menu is under it. */
  abstract handleToggleKeydown(event: KeyboardEvent): void;
}
