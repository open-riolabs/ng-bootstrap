import { Component, Input, OnInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { Collapse } from 'bootstrap';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';
import { VisibilityEvent } from '../../shared/types';

@Component({
    selector: 'rlb-collapse',
    template: ` <div
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

  constructor(elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }

  override getOrCreateInstance(element: HTMLElement): Collapse {
    return Collapse.getOrCreateInstance(element, { toggle: false });
  }

  override get eventPrefix(): string {
    return 'bs.collapse';
  }
}
