import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { RlbHintOverlay } from './hint-overlay.service';
import { RlbHintPlacement } from './hint-panel.component';

/** A tooltip has no header. The panel takes one because a popover does. */
const NO_TITLE = signal('');

/**
 * A short label on hover.
 *
 * It was a `bootstrap.Tooltip` with its own Popper. On the CDK Overlay it is not clipped by a
 * scrolling ancestor, it flips instead of running off the window, and it gains the two things the
 * plugin never gave it here: the trigger points at it with `aria-describedby`, so a screen reader
 * reads it out, and Escape puts it away.
 *
 * Setting the text to `null` still turns it off — it simply refuses to open with nothing to say.
 */
@Directive({
  selector: '[tooltip]',
  providers: [RlbHintOverlay],
  host: {
    '(mouseenter)': 'hint.open()',
    '(mouseleave)': 'hint.close()',
    // Focus, not only hover: a tooltip only a mouse can reach is a tooltip half the people miss.
    '(focusin)': 'hint.open()',
    '(focusout)': 'hint.close()',
    '(keydown.escape)': 'hint.close()',
  },
})
export class TooltipDirective implements OnInit {
  protected hint = inject(RlbHintOverlay);
  private elementRef = inject(ElementRef<HTMLElement>);

  tooltip = input<string | null | undefined>(undefined, { alias: 'tooltip' });
  placement = input<RlbHintPlacement>('top', { alias: 'tooltip-placement' });
  customClass = input('', { alias: 'tooltip-class' });
  html = input(false, { alias: 'tooltip-html', transform: booleanAttribute });

  constructor() {
    // Text that changes while it is up is written straight into the open panel; text that goes
    // away takes the panel with it, which is what disable() used to do.
    effect(() => {
      const text = (this.tooltip() ?? '').trim();
      if (!this.hint.isOpen()) return;
      if (text === '') this.hint.close();
      else this.hint.write();
    });
  }

  ngOnInit(): void {
    this.hint.attachTo(this.elementRef.nativeElement, {
      kind: 'tooltip',
      content: this.tooltip,
      title: NO_TITLE,
      html: this.html,
      panelClass: this.customClass,
      placement: this.placement,
    });
  }
}
