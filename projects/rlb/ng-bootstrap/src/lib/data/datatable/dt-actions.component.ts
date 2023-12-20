import { Component, ContentChildren, DoCheck, Injector, Input, QueryList, ViewChild, ViewContainerRef, ViewEncapsulation, booleanAttribute } from '@angular/core';
import { DataTableActionComponent } from './dt-action.component';
import { HostWrapper } from '../../shared/host-wrapper';
import { WrappedComponent } from '../../shared/wrapped.component';

@Component({
  selector: 'rlb-dt-actions',
  template: `
    <div class="dropdown">
      <button class="btn btn-outline py-0" style="padding: 10px; margin: 0px 16px;" [disabled]="_disabled" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
      <ul class="dropdown-menu">
        <ng-container #projectedActions></ng-container>
      </ul>
    </div>`
})
export class DataTableActionsComponent implements DoCheck {

  @ContentChildren(DataTableActionComponent) actions!: QueryList<DataTableActionComponent>;
  @ViewChild('projectedActions', { read: ViewContainerRef }) _projectedActions!: ViewContainerRef;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean = false

  private wrappedInjector!: Injector;

  constructor(private vcr: ViewContainerRef) { }

  get _disabled() {
    if (this.disabled) return true
    if (!this.actions || this.actions.length === 0) return false;
    return !this.actions.toArray().some(o => !o.disabled)
  }

  ngDoCheck() {
    for (let i = this._projectedActions.length; i > 0; i--) {
      this._projectedActions.detach();
    }
    this.actions.forEach(action => {
      this._projectedActions.insert(action._view);
    });
  }

  get _view() {
    return this.wrappedInjector.get(WrappedComponent, this.vcr).columnView;
  }

  ngOnInit() {
    this.wrappedInjector = new HostWrapper(WrappedComponent, this.vcr);
  }
}
