import { Directive, effect, ElementRef, inject, input, OnInit, signal } from '@angular/core';
import { RlbHintOverlay } from './hint-overlay.service';
import { RlbHintPlacement } from './hint-panel.component';

/** A popover's body is text. Markup in it is the tooltip's business, and its risk. */
const NO_HTML = signal(false);

/**
 * A small card on click: a title, a body, and an arrow pointing at what it is about.
 *
 * It was a `bootstrap.Popover`, configured by writing `data-bs-*` attributes onto the host and
 * calling `update()` after each one — five effects to keep five attributes in step with five
 * inputs. The panel is built from those inputs directly now, so there is nothing to keep in step.
 *
 * On the CDK Overlay it is no longer clipped by a scrolling ancestor, it flips rather than running
 * off the window, and it says whether it is open: the trigger carries `aria-expanded`, a click
 * anywhere else dismisses it, and so does Escape.
 */
@Directive({
  selector: '[popover]',
  providers: [RlbHintOverlay],
  host: {
    '[attr.aria-expanded]': 'hint.isOpen()',
    '(click)': 'hint.toggle()',
    '(keydown.escape)': 'hint.close()',
  },
})
export class PopoverDirective implements OnInit {
  protected hint = inject(RlbHintOverlay);
  private elementRef = inject(ElementRef<HTMLElement>);

  popover = input<string | undefined>(undefined, { alias: 'popover' });
  placement = input<RlbHintPlacement>('top', { alias: 'popover-placement' });
  customClass = input('', { alias: 'popover-class' });
  title = input('', { alias: 'popover-title' });

  constructor() {
    // A title or a body that changes while the card is up is written into it.
    effect(() => {
      const content = (this.popover() ?? '').trim();
      const title = this.title().trim();
      if (!this.hint.isOpen()) return;
      if (content === '' && title === '') this.hint.close();
      else this.hint.write();
    });
  }

  ngOnInit(): void {
    this.hint.attachTo(this.elementRef.nativeElement, {
      kind: 'popover',
      content: this.popover,
      title: this.title,
      html: NO_HTML,
      panelClass: this.customClass,
      placement: this.placement,
      dismissOnOutsideClick: true,
    });
  }
}
