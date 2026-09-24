import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { DestroyRef, inject, Injectable, signal, Signal } from '@angular/core';
import { VisibilityEventBase } from '../../shared/types';
import {
  RlbDropdownAlign,
  RlbDropdownDirection,
  RlbDropdownToggle,
} from './dropdown-host';

/** Bootstrap's own gap between a toggle and its menu: .125rem. */
const GAP = 2;

/** A click on one of these inside the menu is someone using a control, not choosing an item. */
const FORM_TAGS = /^(input|select|option|textarea|form|label)$/i;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The machinery behind every dropdown in the library: one CDK Overlay, one set of positions, one
 * keyboard.
 *
 * It used to be Bootstrap's `Dropdown` plugin, which brought its own Popper and its own rules —
 * a second positioning system beside the CDK the library already depends on, and one that cannot
 * escape an `overflow: hidden` ancestor unless it is told to. The static mode it defaulted to did
 * not reposition at all: a menu near the bottom of the window simply ran off it.
 *
 * The menu is moved into the overlay with a `DomPortal` rather than re-rendered from a template,
 * so it stays part of its component's view — bindings, `@for` and injected services all keep
 * working — and goes back where it was on close.
 *
 * Provided per component, never in root: each dropdown owns one.
 */
@Injectable()
export class RlbDropdownOverlay {
  private overlay = inject(Overlay);

  private toggle?: RlbDropdownToggle;
  private menu?: HTMLElement;
  private align: Signal<RlbDropdownAlign> = signal<RlbDropdownAlign>('start');
  private direction: Signal<RlbDropdownDirection> = signal<RlbDropdownDirection>('down');

  private overlayRef?: OverlayRef;
  private portal?: DomPortal<HTMLElement>;
  private menuPosition: string | null = null;

  readonly isOpen = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  /** The element the menu hangs from, and where its options come from. */
  setToggle(toggle: RlbDropdownToggle) {
    this.toggle = toggle;
  }

  setMenu(element: HTMLElement, align: Signal<RlbDropdownAlign>) {
    this.menu = element;
    this.align = align;
  }

  setDirection(direction: Signal<RlbDropdownDirection>) {
    this.direction = direction;
  }

  open(focusFirst = false) {
    if (this.isOpen() || !this.toggle || !this.menu) return;

    this.emit('show');

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.anchorElement())
        .withPositions(this.positions())
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // No backdrop: a click that closes a menu should also reach whatever it landed on, which is
      // what Bootstrap did and what everyone expects of a menu.
      hasBackdrop: false,
    });

    // Bootstrap's .dropdown-menu is absolutely positioned and hidden until .show. Inside the
    // overlay the absolute one contributes no size, so the pane would measure 0×0 and position
    // against nothing.
    this.menuPosition = this.menu.style.position;
    this.menu.style.position = 'static';
    this.menu.classList.add('show');
    this.toggle.element.classList.add('show');
    this.toggle.element.setAttribute('aria-expanded', 'true');

    this.portal = new DomPortal(this.menu);
    this.overlayRef.attach(this.portal);

    this.overlayRef.outsidePointerEvents().subscribe(event => this.onOutside(event));
    this.overlayRef.overlayElement.addEventListener('click', event => this.onInsideClick(event));
    window.addEventListener('keydown', this.onWindowKeydown, true);

    this.isOpen.set(true);
    this.emit('shown');

    if (focusFirst) this.focusItem(0);
  }

  close(returnFocus = false) {
    if (!this.isOpen()) return;

    this.emit('hide');
    this.dispose();
    this.isOpen.set(false);
    this.emit('hidden');

    if (returnFocus) this.toggle?.element.focus();
  }

  toggleOpen(focusFirst = false) {
    this.isOpen() ? this.close() : this.open(focusFirst);
  }

  private dispose() {
    if (this.menu) {
      this.menu.classList.remove('show');
      // Detaching the portal puts the element back where it came from; its own style goes with it.
      this.menu.style.position = this.menuPosition ?? '';
    }
    this.toggle?.element.classList.remove('show');
    this.toggle?.element.setAttribute('aria-expanded', 'false');

    window.removeEventListener('keydown', this.onWindowKeydown, true);
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.portal = undefined;
    this.menuPosition = null;
  }

  /**
   * The menu's keyboard, caught on the way down rather than on the way up.
   *
   * Bootstrap's dropdown plugin binds a delegated handler for `.dropdown-menu` — a class this menu
   * still wears for its styling — and `EventHandler` binds every delegated handler on `document`
   * **in the capture phase**, so it runs before anything closer to the target. Given an arrow key
   * it looks for the `[data-bs-toggle="dropdown"]` that used to sit beside the menu, finds nothing,
   * builds a `Dropdown` on `undefined` and throws: an uncaught TypeError on every arrow press.
   *
   * Capture on `window` is the one place that comes before `document`, so the key is taken there.
   * The CDK's own `keydownEvents()` would be the natural home, but it listens on `body` and never
   * gets the chance.
   */
  private onWindowKeydown = (event: KeyboardEvent) => {
    const overlayElement = this.overlayRef?.overlayElement;
    if (!overlayElement) return;

    const target = event.target as Node | null;
    if (target && overlayElement.contains(target)) this.onKeydown(event);
  };

  private emit(event: VisibilityEventBase) {
    this.toggle?.emitStatus(event);
  }

  private autoClose() {
    return this.toggle?.autoClose() ?? 'default';
  }

  /**
   * What the menu lines itself up against.
   *
   * Usually the toggle. A split button asks for its parent instead: the arrow is a sliver at the
   * end of a button group, and a menu aligned to the sliver hangs off the side of the group.
   */
  private anchorElement(): HTMLElement {
    const element = this.toggle!.element;
    return this.toggle?.anchor?.() === 'parent' ? (element.parentElement ?? element) : element;
  }

  private onOutside(event: MouseEvent) {
    // The click that opened it is also a click outside it.
    if (this.toggle?.element.contains(event.target as Node)) return;

    const mode = this.autoClose();
    if (mode === 'default' || mode === 'outside') this.close();
  }

  private onInsideClick(event: Event) {
    const mode = this.autoClose();
    if (mode !== 'default' && mode !== 'inside') return;

    // Ticking a box or typing in a field inside a menu is not choosing an item: closing there
    // would let you hide exactly one column per opening.
    if (FORM_TAGS.test((event.target as HTMLElement).tagName)) return;

    this.close();
  }

  private onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        this.consume(event);
        if (this.autoClose() !== 'manual') this.close(true);
        return;
      case 'Tab':
        // Tab out of a menu closes it, but the focus goes wherever Tab was taking it.
        if (this.autoClose() !== 'manual') this.close();
        return;
      case 'ArrowDown':
        this.consume(event);
        this.step(1);
        return;
      case 'ArrowUp':
        this.consume(event);
        this.step(-1);
        return;
      case 'Home':
        this.consume(event);
        this.focusItem(0);
        return;
      case 'End':
        this.consume(event);
        this.focusItem(this.items().length - 1);
        return;
    }
  }

  /**
   * Takes the key for good.
   *
   * Stopping it matters as much as handling it. Bootstrap's own dropdown plugin binds a keydown
   * handler on the document for anything matching `.dropdown-menu` — a class this menu still wears
   * for its styling — and that handler looks for a `[data-bs-toggle="dropdown"]` beside it. There
   * isn't one any more, so it builds a `Dropdown` on `undefined` and throws: an uncaught TypeError
   * on every arrow key. The CDK's own dispatcher listens on `body`, below Bootstrap's `document`,
   * so stopping here means Bootstrap never sees the key.
   */
  private consume(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Keys the toggle itself receives — the menu has no focus yet.
   *
   * Each one is stopped here as well as handled. The CDK's keyboard dispatcher listens on the
   * document for every open overlay, so an arrow left to carry on rising would be handled twice:
   * once by the toggle and once by the menu it has just opened, landing two items down.
   */
  handleToggleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      if (!this.isOpen()) {
        this.open(true);
        return;
      }
      this.step(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (event.key === 'Escape' && this.isOpen() && this.autoClose() !== 'manual') {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
    }
  }

  /**
   * What the arrows move between: every item that can take focus.
   *
   * Read from the DOM rather than from content children, because the menu takes anything — the
   * library's own `li[rlb-dropdown-item]`, a plain `<li><a class="dropdown-item">`, or a label
   * with a checkbox in it.
   */
  private items(): HTMLElement[] {
    if (!this.menu) return [];

    return Array.from(this.menu.querySelectorAll<HTMLElement>('.dropdown-item'))
      .filter(item => !item.classList.contains('disabled') && !item.hasAttribute('disabled'))
      .map(item => (item.matches(FOCUSABLE) ? item : item.querySelector<HTMLElement>(FOCUSABLE)))
      .filter((item): item is HTMLElement => item !== null);
  }

  private focusItem(index: number) {
    const items = this.items();
    if (items.length === 0) {
      // Arbitrary content: focus the panel itself, so Escape still reaches the overlay.
      const menu = this.menu;
      if (!menu) return;
      if (!menu.hasAttribute('tabindex')) menu.setAttribute('tabindex', '-1');
      menu.focus();
      return;
    }
    items[Math.max(0, Math.min(items.length - 1, index))]?.focus();
  }

  /** Wraps round, as a menu should: down from the last item is the first. */
  private step(delta: number) {
    const items = this.items();
    if (items.length === 0) return;

    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = current === -1 ? (delta > 0 ? 0 : items.length - 1) : (current + delta + items.length) % items.length;
    items[next]?.focus();
  }

  /**
   * The asked-for position first, then the same one flipped, so a menu at the bottom of the window
   * opens upwards instead of running off it — which the static mode never did.
   */
  private positions(): ConnectedPosition[] {
    const [skid = 0, distance = 0] = this.toggle?.offset() ?? [];
    const align = this.align();
    const direction = this.direction();

    const vertical = (below: boolean): ConnectedPosition => ({
      originX: align,
      originY: below ? 'bottom' : 'top',
      overlayX: align,
      overlayY: below ? 'top' : 'bottom',
      offsetX: skid,
      offsetY: (below ? GAP : -GAP) + distance,
    });

    const horizontal = (after: boolean): ConnectedPosition => ({
      originX: after ? 'end' : 'start',
      originY: 'top',
      overlayX: after ? 'start' : 'end',
      overlayY: 'top',
      offsetX: (after ? GAP : -GAP) + skid,
      offsetY: distance,
    });

    switch (direction) {
      case 'up':
      case 'up-center':
        return [vertical(false), vertical(true)];
      case 'left':
        return [horizontal(false), horizontal(true), vertical(true)];
      case 'right':
        return [horizontal(true), horizontal(false), vertical(true)];
      default:
        return [vertical(true), vertical(false)];
    }
  }
}
