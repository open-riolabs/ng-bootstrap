import { Component, ElementRef, input, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { Collapse } from 'bootstrap';
import { VisibilityEvent } from '../../shared/types';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';

@Component({
  selector: 'rlb-collapse',
  template: ` <div
		#collapseRef
    class="collapse"
    [id]="id()"
    [class.collapse-horizontal]="orientation() === 'horizontal'"
  >
    <ng-content></ng-content>
  </div>`,
  host: { '[attr.id]': 'undefined' },
  standalone: false
})
export class CollapseComponent
  extends ToggleAbstractComponent<Collapse>
  implements OnInit, OnDestroy {

  id = input.required<string>({ alias: 'id' });
  orientation = input<'horizontal' | 'vertical'>('vertical', { alias: 'orientation' });

  public override status: VisibilityEvent = 'hidden';
  public override statusChange = output<VisibilityEvent>({ alias: 'statusChange' });

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
