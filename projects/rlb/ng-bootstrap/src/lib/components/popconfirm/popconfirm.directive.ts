import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { Color } from '../../shared/types';
import { PopconfirmPanelComponent } from './popconfirm-panel.component';

export type PopconfirmPlacement = 'top' | 'bottom' | 'left' | 'right';

const POSITIONS: Record<PopconfirmPlacement, ConnectedPosition[]> = {
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  ],
  top: [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  ],
  right: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
  ],
};

/**
 * «Are you sure?», asked next to the button that asked it.
 *
 * `ModalService.openConfirmModal` already existed, but a modal across the whole screen is the
 * wrong size of interruption for «delete this row» — which is the confirmation a console asks
 * most often. This one is anchored to its trigger, closes on Escape or on a click outside, and
 * does nothing at all until the user says yes.
 *
 * Positioned with CDK Overlay, which means it survives a scrolling container and does not have to
 * fight anybody's z-index. That needs `@angular/cdk/overlay-prebuilt.css` in the application's
 * styles; without it the panel has nowhere to live and lands in the top-left corner.
 */
@Directive({
  selector: '[rlb-popconfirm]',
  host: {
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'isOpen()',
    '(click)': 'onTriggerClick($event)',
  },
})
export class PopconfirmDirective {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private elementRef = inject(ElementRef<HTMLElement>);

  /** What is being asked. Also the accessible name of the panel when there is no title. */
  message = input('', { alias: 'rlb-popconfirm' });
  title = input<string | undefined>(undefined, { alias: 'popconfirm-title' });
  confirmLabel = input('Yes', { alias: 'confirm-label' });
  cancelLabel = input('No', { alias: 'cancel-label' });
  /** Colour of the confirm button. Danger by default, because this is usually a deletion. */
  color = input<Color>('danger', { alias: 'confirm-color' });
  placement = input<PopconfirmPlacement>('top');
  disabled = input(false, { transform: booleanAttribute });

  confirmed = output<void>();
  cancelled = output<void>();

  readonly isOpen = signal(false);

  private overlayRef?: OverlayRef;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  protected onTriggerClick(event: MouseEvent) {
    if (this.disabled()) return;
    // The trigger is usually a submit-looking button inside a row; nothing else should react.
    event.preventDefault();
    event.stopPropagation();
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.overlayRef || this.disabled()) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(POSITIONS[this.placement()])
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const panel = this.overlayRef.attach(
      new ComponentPortal(PopconfirmPanelComponent, this.viewContainerRef),
    );
    panel.setInput('message', this.message());
    panel.setInput('title', this.title());
    panel.setInput('confirmLabel', this.confirmLabel());
    panel.setInput('cancelLabel', this.cancelLabel());
    panel.setInput('color', this.color());

    panel.instance.confirmed.subscribe(() => {
      this.close();
      this.confirmed.emit();
    });
    panel.instance.cancelled.subscribe(() => this.dismiss());

    this.overlayRef.backdropClick().subscribe(() => this.dismiss());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.dismiss();
      }
    });

    this.isOpen.set(true);
    panel.changeDetectorRef.detectChanges();
    panel.instance.focusInitial();
  }

  /** Closes and says no. */
  dismiss() {
    if (!this.overlayRef) return;
    this.close();
    this.cancelled.emit();
  }

  close() {
    this.dispose();
    this.isOpen.set(false);
    // Focus goes back where it came from, or it ends up on the document and the keyboard is lost.
    (this.elementRef.nativeElement as HTMLElement).focus?.();
  }

  private dispose() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
