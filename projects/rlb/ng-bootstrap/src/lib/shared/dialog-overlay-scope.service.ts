import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT, inject, Injectable } from '@angular/core';

/**
 * Keeps the CDK's overlay container inside whichever dialog is on top.
 *
 * Bootstrap traps focus in an open modal or offcanvas by watching `focusin` on the document and
 * pulling anything outside the dialog straight back in. Every panel this library opens — a
 * dropdown, a datepicker, a tree select, a popconfirm — is rendered by the CDK at the end of the
 * body, which is *outside* the dialog. So a menu opened from inside a modal would take focus for
 * an instant and have it yanked away again: the menu opens, and the keyboard cannot reach it.
 *
 * Moving the container into the dialog for as long as it is open makes those panels part of what
 * the trap considers inside. The container is `position: fixed` and the dialog sets no transform
 * of its own, so nothing about where the panels land changes.
 *
 * Dialogs stack: the container follows the topmost one and goes back to the body when the last
 * closes.
 */
@Injectable({ providedIn: 'root' })
export class RlbDialogOverlayScope {
  private overlayContainer = inject(OverlayContainer);
  private document = inject(DOCUMENT);

  /** Open dialogs, oldest first. The last one owns the container. */
  private stack: HTMLElement[] = [];

  claim(dialog: HTMLElement) {
    if (this.stack.includes(dialog)) return;
    this.stack.push(dialog);
    this.moveInto(dialog);
  }

  release(dialog: HTMLElement) {
    const before = this.stack.length;
    this.stack = this.stack.filter(open => open !== dialog);
    if (this.stack.length === before) return;

    this.moveInto(this.stack[this.stack.length - 1] ?? this.document.body);
  }

  private moveInto(parent: HTMLElement) {
    // getContainerElement creates it on first use, which is fine: it is only ever one element.
    const container = this.overlayContainer.getContainerElement();
    if (container.parentElement !== parent) parent.appendChild(container);
  }
}
