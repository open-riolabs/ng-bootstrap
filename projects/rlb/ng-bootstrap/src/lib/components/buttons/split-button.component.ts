import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Color, Size } from '../../shared/types';
import { ButtonComponent } from './buttons.component';

/**
 * The action people take, with the ones they sometimes take behind it.
 *
 * A toolbar that offers «Save», «Save and close» and «Save as draft» as three equal buttons makes
 * the reader choose before they have read them. A split button makes the common one a click and
 * leaves the rest one click further away.
 *
 * The menu is whatever you project — `li[rlb-dropdown-item]`, as anywhere else in the library.
 */
@Component({
  selector: 'rlb-split-button',
  template: `
    <div
      class="btn-group"
      [class.btn-group-sm]="size() === 'sm'"
      [class.btn-group-lg]="size() === 'lg'"
    >
      <button
        type="button"
        rlb-button
        [color]="color()"
        [size]="size()"
        [outline]="outline()"
        [disabled]="disabled()"
        (click)="action.emit($event)"
      >
        @if (icon()) {
          <i [class]="icon()" aria-hidden="true"></i>
        }
        <ng-content></ng-content>
      </button>

      <button
        type="button"
        class="btn dropdown-toggle dropdown-toggle-split"
        [class]="toggleClass()"
        [disabled]="disabled() || menuDisabled()"
        data-bs-toggle="dropdown"
        data-bs-reference="parent"
        aria-expanded="false"
        [attr.aria-label]="menuLabel()"
      ></button>

      <ul class="dropdown-menu" [class.dropdown-menu-end]="menuAlign() === 'end'">
        <ng-content select="[rlb-dropdown-item], li"></ng-content>
      </ul>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class SplitButtonComponent {
  color = input<Color>('primary');
  size = input<Size | undefined>('md');
  outline = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  /** Disables only the arrow, for when there is nothing else to offer yet. */
  menuDisabled = input(false, { alias: 'menu-disabled', transform: booleanAttribute });

  icon = input<string | undefined>(undefined);
  /**
   * What the arrow is called. It has no text of its own, so without this a screen reader announces
   * «button» and stops — beside another button that does have a name, which is worse than useless.
   */
  menuLabel = input('More actions');
  /**
   * Which edge the menu lines up with.
   *
   * Starts on the left, as Bootstrap's own split button does — a menu wider than the button it
   * hangs from otherwise spills leftwards out of the toolbar it sits in. `end` is for the button
   * at the right-hand edge, where spilling the other way is what you want.
   */
  menuAlign = input<'start' | 'end'>('start', { alias: 'menu-align' });

  /** The main button was pressed. The menu items emit their own. */
  action = output<MouseEvent>();

  protected toggleClass = computed(() =>
    this.outline() ? `btn-outline-${this.color()}` : `btn-${this.color()}`,
  );
}
