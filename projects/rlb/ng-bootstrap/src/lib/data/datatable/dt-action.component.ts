import { Component, Injector, ViewContainerRef, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { WrappedComponent } from '../../shared/wrapped.component';
import { HostWrapper } from '../../shared/host-wrapper';

@Component({
  selector: 'rlb-dt-action',
  template: `
    <li>
      <button class="dropdown-item" type="button" [disabled]="disabled">
        <ng-content />
      </button>
    </li>`
})
export class DataTableActionComponent {
  private wrappedInjector!: Injector;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) public disabled?: boolean = false

  constructor(private vcr: ViewContainerRef) { }

  get _view() {
    return this.wrappedInjector.get(WrappedComponent, this.vcr).columnView;
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedComponent, this.vcr);
  }
}
