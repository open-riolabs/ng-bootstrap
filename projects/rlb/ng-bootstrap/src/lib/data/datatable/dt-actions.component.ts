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
          aria-expanded="false"
        >
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu">
          <ng-container #projectedActions></ng-container>
        </ul>
      </div>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableActionsComponent implements OnInit {
  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  public template = viewChild.required<TemplateRef<any>>('template');
  actions = contentChildren(DataTableActionComponent);
  _projectedActions = viewChild('projectedActions', {
    read: ViewContainerRef,
  });

  constructor(private viewContainerRef: ViewContainerRef) {
    effect(() => {
      this._renderActions();
    });
  }

  _disabled() {
    if (this.disabled()) return true;
    const actions = this.actions();
    if (!actions || actions.length === 0) return false;
    return !actions.some(o => !o.disabled());
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  private _renderActions() {
    const projectedActions = this._projectedActions();
    const actions = this.actions(); // Signal of DataTableActionComponent[]

    if (projectedActions && actions.length > 0) {
      projectedActions.clear(); // Always use clear() instead of the manual detach loop

      actions.forEach(action => {
        // Check if the child actually has its template signal ready
        const template = action.template();
        if (template) {
          // Parent creates the view. This is safe against race conditions
          // because TemplateRef is available immediately.
          projectedActions.createEmbeddedView(template);
        }
      });
    }
  }
}
