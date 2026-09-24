import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverDirective } from './popover.directive';
import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective, PopoverDirective],
  template: `
    <button
      #tip
      type="button"
      [tooltip]="text()"
      [tooltip-placement]="placement()"
      [tooltip-class]="panelClass()"
      [tooltip-html]="html()"
    >
      Hover me
    </button>

    <button
      #pop
      type="button"
      [popover]="body()"
      [popover-title]="title()"
      popover-placement="bottom"
    >
      Click me
    </button>
  `,
})
class HintHost {
  text = signal<string | null>('A label');
  placement = signal<'top' | 'bottom' | 'left' | 'right'>('top');
  panelClass = signal('');
  html = signal(false);

  body = signal<string | undefined>('The body');
  title = signal('');
}

describe('TooltipDirective / PopoverDirective', () => {
  let fixture: ComponentFixture<HintHost>;
  let host: HintHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const trigger = (index = 0) => element.querySelectorAll('button')[index] as HTMLButtonElement;
  const tooltip = () => document.querySelector('.cdk-overlay-pane .tooltip') as HTMLElement | null;
  const popover = () => document.querySelector('.cdk-overlay-pane .popover') as HTMLElement | null;

  const hover = async (on: boolean) => {
    trigger().dispatchEvent(new MouseEvent(on ? 'mouseenter' : 'mouseleave'));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [HintHost] });
    fixture = TestBed.createComponent(HintHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  describe('tooltip', () => {
    it('shows nothing until the pointer arrives', async () => {
      expect(tooltip()).toBeNull();

      await hover(true);
      expect(tooltip()!.textContent!.trim()).toBe('A label');

      await hover(false);
      expect(tooltip()).toBeNull();
    });

    /** A tooltip only a mouse can reach is one half the people never see. */
    it('shows on focus too', async () => {
      trigger().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      await settle();

      expect(tooltip()).not.toBeNull();

      trigger().dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      await settle();

      expect(tooltip()).toBeNull();
    });

    /** Bootstrap did this and the old directive lost it: without it a screen reader says nothing. */
    it('points the trigger at the panel while it is up, and stops when it is not', async () => {
      await hover(true);

      const id = tooltip()!.id;
      expect(id).toBeTruthy();
      expect(trigger().getAttribute('aria-describedby')).toBe(id);

      await hover(false);
      expect(trigger().hasAttribute('aria-describedby')).toBe(false);
    });

    it('refuses to open with nothing to say', async () => {
      host.text.set(null);
      await settle();

      await hover(true);
      expect(tooltip()).toBeNull();
    });

    it('rewrites itself when the text changes under it', async () => {
      await hover(true);

      host.text.set('Something else');
      await settle();

      expect(tooltip()!.textContent!.trim()).toBe('Something else');
    });

    /** What disable() used to do. */
    it('puts itself away when the text is taken from it', async () => {
      await hover(true);

      host.text.set(null);
      await settle();

      expect(tooltip()).toBeNull();
    });

    it('writes markup only when it was asked to', async () => {
      host.text.set('<strong>Bold</strong>');
      await settle();

      await hover(true);
      expect(tooltip()!.querySelector('strong')).toBeNull();
      expect(tooltip()!.textContent).toContain('<strong>');

      await hover(false);
      host.html.set(true);
      await settle();

      await hover(true);
      expect(tooltip()!.querySelector('strong')).not.toBeNull();
    });

    it('carries the class it was given', async () => {
      host.panelClass.set('my-tooltip');
      await settle();

      await hover(true);
      expect(tooltip()!.classList.contains('my-tooltip')).toBe(true);
    });

    /** Bootstrap's CSS hangs the arrow off this attribute, so it has to say the resolved side. */
    it('says which side it ended up on', async () => {
      await hover(true);
      expect(tooltip()!.getAttribute('data-popper-placement')).toBeTruthy();
    });

    it('goes away on Escape', async () => {
      await hover(true);

      trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();

      expect(tooltip()).toBeNull();
    });
  });

  describe('popover', () => {
    const click = async () => {
      trigger(1).click();
      await settle();
    };

    it('opens and closes on the trigger', async () => {
      expect(popover()).toBeNull();

      await click();
      expect(popover()!.querySelector('.popover-body')!.textContent!.trim()).toBe('The body');

      await click();
      expect(popover()).toBeNull();
    });

    it('says whether it is open', async () => {
      expect(trigger(1).getAttribute('aria-expanded')).toBe('false');

      await click();
      expect(trigger(1).getAttribute('aria-expanded')).toBe('true');
    });

    it('shows a header only when there is one', async () => {
      await click();
      expect(popover()!.querySelector('.popover-header')).toBeNull();

      await click();
      host.title.set('A title');
      await settle();

      await click();
      expect(popover()!.querySelector('.popover-header')!.textContent!.trim()).toBe('A title');
    });

    it('goes away when something else is clicked', async () => {
      await click();

      document.body.click();
      await settle();

      expect(popover()).toBeNull();
    });

    it('goes away on Escape', async () => {
      await click();

      trigger(1).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();

      expect(popover()).toBeNull();
    });

    /** Markup in a card that opens on click is a bigger target than a label on hover. */
    it('writes its body as text, never as markup', async () => {
      host.body.set('<img src=x onerror=alert(1)>');
      await settle();

      await click();
      expect(popover()!.querySelector('img')).toBeNull();
      expect(popover()!.textContent).toContain('<img');
    });
  });
});
