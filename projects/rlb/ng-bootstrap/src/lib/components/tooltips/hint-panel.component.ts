import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The two shapes this panel takes: a label on hover, or a card on click. */
export type RlbHintKind = 'tooltip' | 'popover';

/** Which side of the trigger the panel sits on. */
export type RlbHintPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * What a tooltip and a popover are made of, in Bootstrap's own markup.
 *
 * The classes are Bootstrap's because the styling is Bootstrap's: `.tooltip`, `.tooltip-inner`,
 * `.popover-header` and the rest are what a project's theme overrides, and a panel of our own
 * invention would ignore every one of those overrides.
 *
 * `data-popper-placement` is written even though there is no Popper here: Bootstrap's CSS hangs
 * the arrow off that attribute, and it is the resolved side, not the asked-for one — a tooltip
 * that had to flip says so, and its arrow moves with it.
 */
@Component({
  selector: 'rlb-hint-panel',
  template: `
    <div
      [class]="rootClass()"
      role="tooltip"
      [attr.id]="panelId()"
      [attr.data-popper-placement]="placement()"
    >
      <div [class]="arrowClass()" [style]="arrowStyle()"></div>

      @if (kind() === 'popover' && title()) {
        <h3 class="popover-header">{{ title() }}</h3>
      }

      @if (html()) {
        <div [class]="bodyClass()" [innerHTML]="content()"></div>
      } @else {
        <div [class]="bodyClass()">{{ content() }}</div>
      }
    </div>
  `,
  styles: `
    /*
      Bootstrap positions these absolutely, for a world where Popper writes their coordinates.
      Inside an overlay pane an absolute box contributes no size, so the pane would measure 0×0
      and position against nothing. Relative keeps it in the flow and still anchors the arrow.
    */
    .tooltip,
    .popover {
      position: relative;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintPanelComponent {
  kind = input.required<RlbHintKind>();
  content = input<string | null | undefined>('');
  title = input<string>('');
  html = input(false);
  panelClass = input<string>('');
  placement = input<RlbHintPlacement>('top');
  /** Where the arrow sits along the panel's own edge, in pixels from its start. */
  arrowOffset = input<number | null>(null);
  panelId = input<string | undefined>(undefined);

  protected rootClass = computed(() =>
    [
      this.kind(),
      `bs-${this.kind()}-auto`,
      'fade',
      'show',
      this.panelClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected arrowClass = computed(() => `${this.kind()}-arrow`);
  protected bodyClass = computed(() => (this.kind() === 'tooltip' ? 'tooltip-inner' : 'popover-body'));

  /**
   * Keeps the arrow pointing at the trigger.
   *
   * Popper used to write this as a transform. Without an offset the arrow sits at the corner, and
   * once the overlay has been pushed sideways to stay on screen it would point at nothing at all.
   */
  protected arrowStyle = computed(() => {
    const offset = this.arrowOffset();
    if (offset === null) return null;

    const vertical = this.placement() === 'top' || this.placement() === 'bottom';
    return vertical
      ? `left: ${offset}px; transform: translateX(-50%);`
      : `top: ${offset}px; transform: translateY(-50%);`;
  });
}
