import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Collapse } from 'bootstrap';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';
import { VisibilityEvent } from '../../shared/types';

@Component({
    selector: 'rlb-collapse',
    template: ` <div
		#collapseRef
    class="collapse"
    [id]="id"
    [class.collapse-horizontal]="orientation === 'horizontal'"
  >
    <ng-content></ng-content>
  </div>`,
    host: { '[attr.id]': 'undefined' },
    standalone: false
})
export class CollapseComponent
  extends ToggleAbstractComponent<Collapse>
  implements OnInit, OnDestroy {

  @Input({ alias: `id`, required: true }) id!: string;
  @Input({ alias: 'orientation' }) orientation?: 'horizontal' | 'vertical' = 'vertical';
  @Input({ alias: 'status' }) override status?: VisibilityEvent;

  @Output('statusChange') override statusChange = new EventEmitter<VisibilityEvent>();
	
	@ViewChild('collapseRef', { static: true }) collapseRef!: ElementRef<HTMLElement>;

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }
	
	override ngOnInit(elemnt?: HTMLElement | Element) {
		super.ngOnInit(this.collapseRef.nativeElement);
	}
	
	override getOrCreateInstance(element: HTMLElement): Collapse {
    return Collapse.getOrCreateInstance(element, { toggle: false });
  }

  override get eventPrefix(): string {
    return 'bs.collapse';
  }
}
