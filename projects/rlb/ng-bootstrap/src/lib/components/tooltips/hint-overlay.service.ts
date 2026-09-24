import {
  ConnectedPosition,
  ConnectionPositionPair,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  DestroyRef,
  inject,
  Injectable,
  signal,
  Signal,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';
import { HintPanelComponent, RlbHintKind, RlbHintPlacement } from './hint-panel.component';

/** Bootstrap's own gap between a trigger and its panel: 6px for a tooltip, 8px for a popover. */
const GAP: Record<RlbHintKind, number> = { tooltip: 6, popover: 8 };

/** What the panel needs to know, read fresh every time it opens. */
export interface RlbHintConfig {
  kind: RlbHintKind;
  content: Signal<string | null | undefined>;
  title: Signal<string>;
  html: Signal<boolean>;
  panelClass: Signal<string>;
  placement: Signal<RlbHintPlacement>;
  /** Whether a click anywhere else puts it away. True for a popover, pointless for a tooltip. */
  dismissOnOutsideClick?: boolean;
}

/**
 * The overlay behind `[tooltip]` and `[popover]`.
 *
 * These were the last two things in the library positioned by Bootstrap's JavaScript. Moving them
 * buys what it bought the dropdown — a panel that is not clipped by a scrolling ancestor, and one
 * that flips rather than running off the window — plus the part Bootstrap never did here: the
 * tooltip is now tied to its trigger with `aria-describedby`, so a screen reader reads it, and
 * Escape dismisses it.
 *
 * Provided per directive, never in root: each trigger owns one.
 */
@Injectable()
export class RlbHintOverlay {
  private overlay = inject(Overlay);
  private idService = inject(UniqueIdService);

  private overlayRef?: OverlayRef;
  private panelRef?: ComponentRef<HintPanelComponent>;
  private trigger?: HTMLElement;
  private config?: RlbHintConfig;
  private describedBy?: string;

  readonly isOpen = signal(false);
  private readonly panelId = 'rlb-hint' + this.idService.id;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.close());
  }

  attachTo(trigger: HTMLElement, config: RlbHintConfig) {
    this.trigger = trigger;
    this.config = config;
  }

  /** What the panel would say right now. Empty means there is nothing to show. */
  private text(): string {
    return (this.config?.content() ?? '').toString().trim();
  }

  open() {
    if (this.isOpen() || !this.trigger || !this.config) return;
    if (this.text() === '' && !(this.config.kind === 'popover' && this.config.title())) return;

    const kind = this.config.kind;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.trigger)
        .withPositions(this.positions())
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
    });

    this.panelRef = this.overlayRef.attach(new ComponentPortal(HintPanelComponent));
    this.write();

    const strategy = this.overlayRef.getConfig().positionStrategy as {
      positionChanges?: { subscribe: (fn: (change: { connectionPair: ConnectionPositionPair }) => void) => void };
    };
    strategy.positionChanges?.subscribe(change => this.onPositioned(change.connectionPair));

    // A tooltip nobody can read is decoration: tie it to the trigger for a screen reader.
    if (kind === 'tooltip') {
      this.describedBy = this.trigger.getAttribute('aria-describedby') ?? undefined;
      this.trigger.setAttribute('aria-describedby', this.panelId);
    }

    if (this.config.dismissOnOutsideClick) {
      this.overlayRef.outsidePointerEvents().subscribe(event => {
        // The click that opened it is also a click outside it.
        if (!this.trigger?.contains(event.target as Node)) this.close();
      });
    }

    this.isOpen.set(true);
    // The first placement comes from the strategy; measure once it has been applied.
    requestAnimationFrame(() => this.placeArrow(this.panelRef?.instance.placement() ?? 'top'));
  }

  close() {
    if (!this.overlayRef) return;

    if (this.trigger) {
      if (this.describedBy) this.trigger.setAttribute('aria-describedby', this.describedBy);
      else this.trigger.removeAttribute('aria-describedby');
    }
    this.describedBy = undefined;

    this.overlayRef.dispose();
    this.overlayRef = undefined;
    this.panelRef = undefined;
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  /** Pushes the current inputs into the panel — also what a content change while open calls. */
  write() {
    const panel = this.panelRef;
    const config = this.config;
    if (!panel || !config) return;

    panel.setInput('kind', config.kind);
    panel.setInput('content', config.content() ?? '');
    panel.setInput('title', config.title());
    panel.setInput('html', config.html());
    panel.setInput('panelClass', config.panelClass());
    panel.setInput('panelId', this.panelId);
  }

  /** Whether the overlay holds this node, so a click can be told from an outside one. */
  contains(node: Node | null): boolean {
    return !!node && !!this.overlayRef?.overlayElement.contains(node);
  }

  private onPositioned(pair: ConnectionPositionPair) {
    const placement = RlbHintOverlay.placementOf(pair);
    this.panelRef?.setInput('placement', placement);
    this.placeArrow(placement);
  }

  /** Which side the panel actually ended up on, which is not always the one that was asked for. */
  private static placementOf(pair: ConnectionPositionPair): RlbHintPlacement {
    if (pair.overlayY === 'bottom' && pair.originY === 'top') return 'top';
    if (pair.overlayY === 'top' && pair.originY === 'bottom') return 'bottom';
    if (pair.overlayX === 'end' && pair.originX === 'start') return 'left';
    return 'right';
  }

  /**
   * Points the arrow at the trigger.
   *
   * The panel is centred on the trigger until the overlay has to push it sideways to keep it on
   * screen — and then an arrow left at the middle points at nothing. It is measured rather than
   * assumed, and kept a corner's width away from either end.
   */
  private placeArrow(placement: RlbHintPlacement) {
    const trigger = this.trigger;
    const root = this.overlayRef?.overlayElement.firstElementChild?.firstElementChild as HTMLElement | undefined;
    const arrow = root?.querySelector<HTMLElement>('.tooltip-arrow, .popover-arrow');
    if (!trigger || !root || !arrow) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = root.getBoundingClientRect();
    const vertical = placement === 'top' || placement === 'bottom';

    const size = (vertical ? arrow.offsetWidth : arrow.offsetHeight) || 8;
    const centre = vertical
      ? triggerRect.left + triggerRect.width / 2 - panelRect.left
      : triggerRect.top + triggerRect.height / 2 - panelRect.top;
    const span = vertical ? panelRect.width : panelRect.height;

    this.panelRef?.setInput('arrowOffset', Math.max(size, Math.min(span - size, centre)));
  }

  private positions(): ConnectedPosition[] {
    const gap = GAP[this.config!.kind];

    const above: ConnectedPosition = {
      originX: 'center', originY: 'top',
      overlayX: 'center', overlayY: 'bottom',
      offsetY: -gap,
    };
    const below: ConnectedPosition = {
      originX: 'center', originY: 'bottom',
      overlayX: 'center', overlayY: 'top',
      offsetY: gap,
    };
    const before: ConnectedPosition = {
      originX: 'start', originY: 'center',
      overlayX: 'end', overlayY: 'center',
      offsetX: -gap,
    };
    const after: ConnectedPosition = {
      originX: 'end', originY: 'center',
      overlayX: 'start', overlayY: 'center',
      offsetX: gap,
    };

    switch (this.config!.placement()) {
      case 'bottom':
        return [below, above, after, before];
      case 'left':
        return [before, after, above, below];
      case 'right':
        return [after, before, above, below];
      default:
        return [above, below, after, before];
    }
  }
}
