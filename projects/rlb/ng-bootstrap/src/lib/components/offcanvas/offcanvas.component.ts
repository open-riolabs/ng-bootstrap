import {
  booleanAttribute,
  Component,
  DOCUMENT,
  ElementRef,
  Inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { Offcanvas } from 'bootstrap';
import { VisibilityEvent } from '../../shared/types';
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
  standalone: false
})
export class OffcanvasComponent
  extends ToggleAbstractComponent<Offcanvas>
  implements OnInit, OnDestroy {

  id = input.required<string>({ alias: 'id' });
  bodyScroll = input(false, { alias: 'body-scroll', transform: booleanAttribute });
  scrollBackup = input(false, { alias: 'scroll-backup', transform: booleanAttribute });
  closeManual = input(false, { alias: 'close-manual', transform: booleanAttribute });
  placement = input<'start' | 'end' | 'top' | 'bottom'>('start', { alias: 'placement' });
  responsive = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined>(undefined, { alias: 'responsive' });

  public override status: VisibilityEvent = 'hidden';
  public override statusChange = output<VisibilityEvent>({ alias: 'statusChange' });

  constructor(elementRef: ElementRef<HTMLElement>, @Inject(DOCUMENT) private document: Document) {
    super(elementRef);
  }

  override ngOnInit(elemnt?: HTMLElement | Element) {
    super.ngOnInit(elemnt);

    const nativeEl = this.elementRef?.nativeElement;

    if (nativeEl && nativeEl.parentElement !== this.document.body) {
      this.document.body.appendChild(nativeEl);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    const nativeEl = this.elementRef?.nativeElement;

    if (nativeEl && nativeEl.parentElement === this.document.body) {
      this.document.body.removeChild(nativeEl);
    }
  }

  override getOrCreateInstance(element: HTMLElement): Offcanvas {
    const existingInstance = Offcanvas.getInstance(element);
    if (existingInstance) {
      existingInstance.dispose();
    }

    return Offcanvas.getOrCreateInstance(element, {
      scroll: this.bodyScroll() ?? false,
      keyboard: !this.closeManual(),
      backdrop: this.closeManual() ? 'static' : true
    });
  }

  override get eventPrefix(): string {
    return 'bs.offcanvas';
  }
}
