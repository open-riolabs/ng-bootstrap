import {
  booleanAttribute,
  Component,
  contentChildren,
  input,
  TemplateRef,
  viewChild,
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
          <!-- Delegate rendering to Angular instead of manual ViewContainerRef manipulation -->
          @for (action of actions(); track $index) {
            <ng-container *ngTemplateOutlet="action.template()"></ng-container>
          }
        </ul>
      </div>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableActionsComponent {
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  public template = viewChild.required<TemplateRef<any>>('template');
  actions = contentChildren(DataTableActionComponent);

  _disabled() {
    if (this.disabled()) return true;
    const actions = this.actions();
    if (!actions || actions.length === 0) return false;
    return !actions.some(o => !o.disabled());
  }
}
