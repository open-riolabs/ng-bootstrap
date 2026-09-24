import { Directive, ElementRef, inject, input, OnInit, output } from '@angular/core';
import { VisibilityEventBase } from '../../shared/types';
import { RlbDropdownAnchor, RlbDropdownAutoClose, RlbDropdownHost } from './dropdown-host';

/**
 * The thing you press to open a dropdown.
 *
 * It no longer creates a `bootstrap.Dropdown`: it tells the `rlb-dropdown` around it to open, and
 * that one owns the overlay. The `data-bs-*` attributes are gone with the plugin — nothing reads
 * them any more, and leaving them would invite Bootstrap's own global handler to fight ours if the
 * host page loads its bundle.
 */
@Directive({
  selector: 'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
  host: {
    class: 'dropdown-toggle',
    'aria-haspopup': 'true',
    'aria-expanded': 'false',
    '(click)': 'onClick($any($event))',
    '(keydown)': 'onKeydown($any($event))',
  },
})
export class DropdownDirective implements OnInit {
  private elementRef = inject(ElementRef<HTMLElement>);
  protected host = inject(RlbDropdownHost, { optional: true });

  /**
   * `[x, y]` in pixels, shifting the menu along and away from the toggle.
   *
   * It used to double as the switch between Bootstrap's static and dynamic positioning. There is
   * only one mode now — the menu is always positioned, and always flips rather than overflowing —
   * so an offset is only ever an offset.
   */
  offset = input<number[]>([], { alias: 'offset' });
  autoClose = input<RlbDropdownAutoClose>('default', { alias: 'auto-close' });
  /**
   * Whether the menu lines up with this element or with the box around it.
   *
   * `parent` is Bootstrap's `data-bs-reference="parent"`, and it is what a split button needs: the
   * arrow is a sliver at the end of a button group, and a menu aligned to the sliver rather than
   * to the group hangs off its side.
   */
  anchor = input<RlbDropdownAnchor>('self');

  statusChanged = output<VisibilityEventBase>({ alias: 'status-changed' });

  ngOnInit(): void {
    const element = this.elementRef.nativeElement as HTMLElement;

    // An <a> with no href is not a control; give it the role it is playing.
    if (element.nodeName.toLowerCase() === 'a' && !element.hasAttribute('href')) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }

    this.host?.registerToggle({
      element,
      offset: this.offset,
      autoClose: this.autoClose,
      anchor: this.anchor,
      emitStatus: (event: VisibilityEventBase) => this.statusChanged.emit(event),
    });
  }

  protected onClick(event: MouseEvent) {
    // An anchor toggle used to need href="#", which then jumped the page to the top.
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'a') event.preventDefault();
    this.host?.toggle();
  }

  protected onKeydown(event: KeyboardEvent) {
    const element = this.elementRef.nativeElement as HTMLElement;
    // A span or a bare anchor gets no click from the keyboard, so Enter and Space are ours.
    if ((event.key === 'Enter' || event.key === ' ') && element.nodeName.toLowerCase() !== 'button') {
      event.preventDefault();
      this.host?.toggle();
      return;
    }
    this.host?.handleToggleKeydown(event);
  }
}
