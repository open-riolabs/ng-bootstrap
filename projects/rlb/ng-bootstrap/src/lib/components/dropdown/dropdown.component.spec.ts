import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisibilityEventBase } from '../../shared/types';
import { DropdownContainerComponent } from './dropdown-container.component';
import { RlbDropdownAutoClose } from './dropdown-host';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';
import { DropdownComponent } from './dropdown.component';
import { DropdownDirective } from './dropdown.directive';

@Component({
  imports: [
    DropdownComponent,
    DropdownDirective,
    DropdownContainerComponent,
    DropdownMenuItemComponent,
  ],
  template: `
    <rlb-dropdown [direction]="direction()">
      <button rlb-dropdown [auto-close]="autoClose()" (status-changed)="events.push($event)">
        Menu
      </button>
      <ul rlb-dropdown-menu [placement]="placement()">
        <li rlb-dropdown-item header>Heading</li>
        <li rlb-dropdown-item>First</li>
        <li rlb-dropdown-item disabled>Blocked</li>
        <li rlb-dropdown-item>Second</li>
        <li>
          <label class="dropdown-item"><input type="checkbox" /> A box</label>
        </li>
      </ul>
    </rlb-dropdown>
  `,
})
class DropdownHost {
  direction = signal<'up' | 'down' | 'left' | 'right'>('down');
  autoClose = signal<RlbDropdownAutoClose>('default');
  placement = signal<'left' | 'right' | undefined>(undefined);
  events: VisibilityEventBase[] = [];
}

describe('DropdownComponent', () => {
  let fixture: ComponentFixture<DropdownHost>;
  let host: DropdownHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const toggle = () => element.querySelector('.dropdown-toggle') as HTMLButtonElement;
  const pane = () => document.querySelector('.cdk-overlay-pane');
  const menu = () => document.querySelector('.cdk-overlay-pane .dropdown-menu') as HTMLElement;

  const items = () =>
    Array.from(document.querySelectorAll<HTMLElement>('.cdk-overlay-pane .dropdown-item'));

  const open = async () => {
    toggle().click();
    await settle();
  };

  /** Bootstrap's own handler is bound on the document in capture, so the menu takes keys on window. */
  const press = async (key: string, target: EventTarget = document.activeElement!) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [DropdownHost] });
    fixture = TestBed.createComponent(DropdownHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  it('leaves the menu where it was written until it is opened', () => {
    expect(pane()).toBeNull();
    expect(element.querySelector('.dropdown-menu')).not.toBeNull();
  });

  /** The whole point of the move: the menu is no longer trapped in its own corner of the page. */
  it('moves the menu into the overlay and puts it back on close', async () => {
    await open();

    expect(menu()).not.toBeNull();
    expect(element.querySelector('.dropdown-menu')).toBeNull();
    expect(menu().classList.contains('show')).toBe(true);

    toggle().click();
    await settle();

    expect(pane()).toBeNull();
    expect(element.querySelector('.dropdown-menu')).not.toBeNull();
  });

  it('says whether it is open', async () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');

    await open();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(toggle().classList.contains('show')).toBe(true);

    toggle().click();
    await settle();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('reports the four moments it used to report', async () => {
    await open();
    expect(host.events).toEqual(['show', 'shown']);

    toggle().click();
    await settle();
    expect(host.events).toEqual(['show', 'shown', 'hide', 'hidden']);
  });

  describe('items', () => {
    /** A span with role="button" that Tab skips is a role without the behaviour it claims. */
    it('renders an action as a real button', async () => {
      await open();

      const first = items()[0];
      expect(first.tagName).toBe('BUTTON');
      expect(first.textContent!.trim()).toBe('First');
    });

    it('disables the blocked one for the pointer and the keyboard alike', async () => {
      await open();

      const blocked = items().find(item => item.textContent!.trim() === 'Blocked')!;
      expect((blocked as HTMLButtonElement).disabled).toBe(true);
    });

    it('keeps a header out of the items', async () => {
      await open();

      expect(items().map(item => item.textContent!.trim())).not.toContain('Heading');
      expect(menu().querySelector('.dropdown-header')!.textContent!.trim()).toBe('Heading');
    });
  });

  describe('closing', () => {
    it('closes when something outside is clicked', async () => {
      await open();

      document.body.click();
      await settle();

      expect(pane()).toBeNull();
    });

    it('stays open when told to close manually', async () => {
      host.autoClose.set('manual');
      await settle();
      await open();

      document.body.click();
      await settle();
      expect(pane()).not.toBeNull();

      await press('Escape', menu());
      expect(pane()).not.toBeNull();

      toggle().click();
      await settle();
      expect(pane()).toBeNull();
    });

    it('ignores a click outside when it only closes from inside', async () => {
      host.autoClose.set('inside');
      await settle();
      await open();

      document.body.click();
      await settle();

      expect(pane()).not.toBeNull();
    });

    it('ignores a click inside when it only closes from outside', async () => {
      host.autoClose.set('outside');
      await settle();
      await open();

      items()[0].click();
      await settle();

      expect(pane()).not.toBeNull();
    });

    /** Otherwise a column menu lets you hide exactly one column per opening. */
    it('stays open when a control inside it is used', async () => {
      await open();

      (menu().querySelector('input[type="checkbox"]') as HTMLInputElement).click();
      await settle();

      expect(pane()).not.toBeNull();
    });

    it('closes when an item is chosen', async () => {
      await open();

      items()[0].click();
      await settle();

      expect(pane()).toBeNull();
    });
  });

  describe('keyboard', () => {
    it('opens on the down arrow with the first item focused', async () => {
      toggle().focus();
      await press('ArrowDown', toggle());

      expect(pane()).not.toBeNull();
      expect(document.activeElement!.textContent!.trim()).toBe('First');
    });

    it('walks the items, skips the disabled one and wraps round', async () => {
      toggle().focus();
      await press('ArrowDown', toggle());

      await press('ArrowDown');
      expect(document.activeElement!.textContent!.trim()).toBe('Second');

      await press('ArrowDown');
      expect(document.activeElement!.tagName).toBe('INPUT');

      await press('ArrowDown');
      expect(document.activeElement!.textContent!.trim()).toBe('First');

      await press('ArrowUp');
      expect(document.activeElement!.tagName).toBe('INPUT');
    });

    it('jumps to either end', async () => {
      toggle().focus();
      await press('ArrowDown', toggle());

      await press('End');
      expect(document.activeElement!.tagName).toBe('INPUT');

      await press('Home');
      expect(document.activeElement!.textContent!.trim()).toBe('First');
    });

    it('closes on Escape and gives the focus back', async () => {
      toggle().focus();
      await press('ArrowDown', toggle());

      await press('Escape');

      expect(pane()).toBeNull();
      expect(document.activeElement).toBe(toggle());
    });

    /**
     * Bootstrap binds its own dropdown keys on the document in the capture phase, so a key the
     * menu has dealt with has to be stopped or it reaches a plugin that no longer has a toggle to
     * work with — and throws.
     */
    it('takes the keys it handles out of circulation', async () => {
      toggle().focus();
      await press('ArrowDown', toggle());

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      let reachedDocument = false;
      const listener = () => (reachedDocument = true);
      document.addEventListener('keydown', listener, true);

      document.activeElement!.dispatchEvent(event);
      await settle();

      document.removeEventListener('keydown', listener, true);
      expect(reachedDocument).toBe(false);
      expect(event.defaultPrevented).toBe(true);
    });
  });
});
