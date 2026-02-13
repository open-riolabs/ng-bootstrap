import {
  booleanAttribute,
  Component,
  contentChildren,
  effect,
  EmbeddedViewRef,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableActionComponent } from './dt-action.component';

@Component({
  selector: 'rlb-dt-actions',
  template: `
    <ng-template #template>
      <div class="dropdown">
        <button
          class="btn btn-outline py-0 pe-2 float-end"
          [disabled]="_disabled()"
          type="button"
          data-bs-toggle="dropdown"
          data-bs-popper-config='{"strategy":"fixed"}'
          aria-expanded="false">
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu">
          <ng-container #projectedActions></ng-container>
        </ul>
      </div>

    </ng-template>
  `,
  standalone: false
})
export class DataTableActionsComponent implements OnInit {
  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  template = viewChild.required<TemplateRef<any>>('template');
  actions = contentChildren(DataTableActionComponent);
  _projectedActions = viewChild<ViewContainerRef>('projectedActions');

  constructor(private viewContainerRef: ViewContainerRef) {
    effect(() => {
      this._renderActions();
    });
  }

  _disabled() {
    if (this.disabled()) return true;
    const actions = this.actions();
    if (!actions || actions.length === 0) return false;
    return !actions.some((o) => !o.disabled());
  }

  get _view() {
    return this.temp;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  private _renderActions() {
    const projectedActions = this._projectedActions();
    const actions = this.actions();
    if (projectedActions && actions) {
      for (let i = projectedActions.length; i > 0; i--) {
        projectedActions.detach();
      }
      actions.forEach((action) => {
        projectedActions.insert(action._view);
      });
    }
  }
}
