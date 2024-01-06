import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  booleanAttribute,
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
    '[id]': 'id',
    '[class.offcanvas]': '!responsive',
    '[class.offcanvas-sm]': 'responsive === "sm"',
    '[class.offcanvas-md]': 'responsive === "md"',
    '[class.offcanvas-lg]': 'responsive === "lg"',
    '[class.offcanvas-xl]': 'responsive === "xl"',
    '[class.offcanvas-xxl]': 'responsive === "xxl"',
    '[class.offcanvas-start]': 'placement === "start"',
    '[class.offcanvas-end]': 'placement === "end"',
    '[class.offcanvas-top]': 'placement === "top"',
    '[class.offcanvas-bottom]': 'placement === "bottom"',
  },
})
export class OffcanvasComponent
  extends ToggleAbstractComponent<Offcanvas>
  implements OnInit, OnDestroy
{
  @Input({ alias: `id`, required: true }) id!: string;
  @Input({ transform: booleanAttribute, alias: 'body-scroll' })
  bodyScroll: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'scroll-backup' })
  scrollBackup: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'close-manual' })
  closeManual: boolean = false;
  @Input('placement') placement: 'start' | 'end' | 'top' | 'bottom' = 'start';
  @Input('responsive') responsive!: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  @Output() openChange = new EventEmitter<VisibilityEvent>();

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }

  override getOrCreateInstance(element: HTMLElement): Offcanvas {
    return Offcanvas.getOrCreateInstance(element);
  }

  override get eventPrefix(): string {
    return 'bs.offcanvas';
  }
}
