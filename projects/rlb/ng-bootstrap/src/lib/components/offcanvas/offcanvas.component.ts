import {
  booleanAttribute,
  Component,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
    standalone: false
})
export class OffcanvasComponent
  extends ToggleAbstractComponent<Offcanvas>
  implements OnInit, OnDestroy {

  @Input({ alias: `id`, required: true }) id!: string;
  @Input({ alias: 'body-scroll', transform: booleanAttribute }) bodyScroll?: boolean;
  @Input({ alias: 'scroll-backup', transform: booleanAttribute }) scrollBackup?: boolean;
  @Input({ alias: 'close-manual', transform: booleanAttribute }) closeManual?: boolean;
  @Input({ alias: 'placement' }) placement?: 'start' | 'end' | 'top' | 'bottom' = 'start';
  @Input({ alias: 'responsive' }) responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  @Input() override status?: VisibilityEvent;

  @Output() override statusChange = new EventEmitter<VisibilityEvent>();
	
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
			scroll: this.bodyScroll ?? false,
			keyboard: this.closeManual ? false : true,
			backdrop: this.closeManual ? 'static' : true
		});
  }

  override get eventPrefix(): string {
    return 'bs.offcanvas';
  }
}
