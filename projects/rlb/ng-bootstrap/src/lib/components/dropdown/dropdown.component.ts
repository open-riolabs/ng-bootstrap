import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  Signal,
  signal,
} from '@angular/core';
import {
  RlbDropdownAlign,
  RlbDropdownDirection,
  RlbDropdownHost,
  RlbDropdownToggle,
} from './dropdown-host';
import { RlbDropdownOverlay } from './dropdown-overlay.service';

/**
 * A toggle and the menu it opens.
 *
 * The element itself keeps Bootstrap's `.dropdown` / `.dropup` classes so existing CSS still
 * matches, but they no longer do any work: the menu is positioned by the CDK Overlay, which is
 * also what lets it escape a scrolling container or a table cell with `overflow: hidden` — the
 * one thing the Bootstrap plugin could not do without being told to render in a fixed strategy.
 */
@Component({
  selector: 'rlb-dropdown',
  template: `
    <!-- Anything else first, so a split button can put its main action before the toggle. -->
    <ng-content />
    <ng-content select="a[rlb-dropdown], button[rlb-dropdown], span[rlb-dropdown]" />
    <ng-content select="[rlb-dropdown-menu], rlb-dropdown-container" />
  `,
  host: {
    '[class.dropdown]': 'direction() === "down"',
    '[class.dropdown-center]': 'direction() === "down-center"',
    '[class.dropup]': 'direction() === "up" || direction() === "up-center"',
    '[class.dropup-center]': 'direction() === "up-center"',
    '[class.dropstart]': 'direction() === "left"',
    '[class.dropend]': 'direction() === "right"',
  },
  providers: [
    RlbDropdownOverlay,
    { provide: RlbDropdownHost, useExisting: forwardRef(() => DropdownComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements RlbDropdownHost {
  private overlay = inject(RlbDropdownOverlay);

  direction = input<RlbDropdownDirection>('down', { alias: 'direction' });

  readonly isOpen = this.overlay.isOpen;

  /** What the container asked for, until one registers itself. */
  private menuAlign = signal<Signal<RlbDropdownAlign>>(signal<RlbDropdownAlign>('start'));

  /** A centred direction decides the alignment itself; otherwise the container does. */
  private align = computed<RlbDropdownAlign>(() =>
    this.direction().endsWith('-center') ? 'center' : this.menuAlign()(),
  );

  constructor() {
    this.overlay.setDirection(this.direction);
  }

  registerToggle(toggle: RlbDropdownToggle) {
    this.overlay.setToggle(toggle);
  }

  registerMenu(element: HTMLElement, align: Signal<RlbDropdownAlign>) {
    this.menuAlign.set(align);
    this.overlay.setMenu(element, this.align);
  }

  open(focusFirst = false) {
    this.overlay.open(focusFirst);
  }

  close(returnFocus = false) {
    this.overlay.close(returnFocus);
  }

  toggle() {
    this.overlay.toggleOpen();
  }

  handleToggleKeydown(event: KeyboardEvent) {
    this.overlay.handleToggleKeydown(event);
  }
}
