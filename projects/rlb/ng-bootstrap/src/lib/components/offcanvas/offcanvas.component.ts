import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import type { Offcanvas } from 'bootstrap';
import bootstrap from '../../shared/bootstrap';
import { RlbDialogOverlayScope } from '../../shared/dialog-overlay-scope.service';
import { VisibilityEvent } from '../../shared/types';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';

@Component({
    selector: 'rlb-offcanvas',
    template: `
    <ng-content select="rlb-offcanvas-header"></ng-content>
    <ng-content select="rlb-offcanvas-body"></ng-content>
  `,
    host: {
        tabindex: '-1',
        '[id]': 'id()',
        '[class.offcanvas]': '!responsive()',
        '[class.offcanvas-sm]': 'responsive() === "sm"',
        '[class.offcanvas-md]': 'responsive() === "md"',
        '[class.offcanvas-lg]': 'responsive() === "lg"',
        '[class.offcanvas-xl]': 'responsive() === "xl"',
        '[class.offcanvas-xxl]': 'responsive() === "xxl"',
        '[class.offcanvas-start]': 'placement() === "start"',
        '[class.offcanvas-end]': 'placement() === "end"',
        '[class.offcanvas-top]': 'placement() === "top"',
        '[class.offcanvas-bottom]': 'placement() === "bottom"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffcanvasComponent
  extends ToggleAbstractComponent<Offcanvas>
  implements OnInit, OnDestroy
{
  id = input.required<string>({ alias: 'id' });
  bodyScroll = input(false, { alias: 'body-scroll', transform: booleanAttribute });
  scrollBackup = input(false, {
    alias: 'scroll-backup',
    transform: booleanAttribute,
  });
  closeManual = input(false, {
    alias: 'close-manual',
    transform: booleanAttribute,
  });
  placement = input<'start' | 'end' | 'top' | 'bottom'>('start', {
    alias: 'placement',
  });
  responsive = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined>(undefined, {
    alias: 'responsive',
  });

  public override status: VisibilityEvent = 'hidden';
  public override statusChange = output<VisibilityEvent>({
    alias: 'statusChange',
  });

  private document = inject(DOCUMENT);
  private overlayScope = inject(RlbDialogOverlayScope);
  private idService = inject(UniqueIdService);

  constructor() {
    super();
  }

  override ngOnInit(elemnt?: HTMLElement | Element) {
    super.ngOnInit(elemnt);

    const nativeEl = this.elementRef?.nativeElement;

    if (nativeEl && nativeEl.parentElement !== this.document.body) {
      this.document.body.appendChild(nativeEl);
    }

    if (nativeEl) this.scopeOverlays(nativeEl);
  }

  /**
   * Gives the panel the name a screen reader reads out.
   *
   * Bootstrap writes `role="dialog"` and `aria-modal` itself but cannot know what the thing is
   * called, so without this it announces «dialog» and stops.
   */
  private nameDialog(): void {
    const element = this.elementRef?.nativeElement;
    if (!element) return;
    // Anything the caller said itself wins, including a labelledby pointing at their own heading.
    if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) return;

    const title = element.querySelector<HTMLElement>('.offcanvas-title');
    if (!title) return;

    if (!title.id) title.id = `rlb-offcanvas-title${this.idService.id}`;
    element.setAttribute('aria-labelledby', title.id);
  }

  /**
   * Takes the CDK's overlay container along for the ride.
   *
   * Bootstrap's focus trap pulls anything outside the panel straight back in, and every panel this
   * library opens is rendered by the CDK at the end of the body — outside. Without this, a select
   * or a datepicker opened inside an offcanvas cannot be reached from the keyboard at all.
   *
   * Its own listeners rather than an override: the base class holds its handler in a field, which
   * a subclass cannot call through `super`.
   */
  private scopeOverlays(element: HTMLElement): void {
    // Named on the way in rather than at init: the header is projected content, and at ngOnInit
    // the heading it holds is not in the DOM to be found yet.
    element.addEventListener(`show.${this.eventPrefix}`, () => this.nameDialog());
    element.addEventListener(`shown.${this.eventPrefix}`, () => this.overlayScope.claim(element));
    element.addEventListener(`hidden.${this.eventPrefix}`, () => this.overlayScope.release(element));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    const nativeEl = this.elementRef?.nativeElement;
    if (nativeEl) this.overlayScope.release(nativeEl);

    if (nativeEl && nativeEl.parentElement === this.document.body) {
      this.document.body.removeChild(nativeEl);
    }
  }

  override getOrCreateInstance(element: HTMLElement): Offcanvas {
    const existingInstance = bootstrap.Offcanvas.getInstance(element);
    if (existingInstance) {
      existingInstance.dispose();
    }

    return bootstrap.Offcanvas.getOrCreateInstance(element, {
      scroll: this.bodyScroll() ?? false,
      keyboard: !this.closeManual(),
      backdrop: this.closeManual() ? 'static' : true
    });
  }

  override get eventPrefix(): string {
    return 'bs.offcanvas';
  }
}
