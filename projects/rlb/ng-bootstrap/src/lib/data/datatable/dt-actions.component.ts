import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { DataTableActionComponent } from './dt-action.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'rlb-dt-actions',
    template: `
    <ng-template #template>
      <div class="dropdown">
        <button
          class="btn btn-outline py-0 pe-2 float-end"
          [disabled]="_disabled()"
          [attr.aria-label]="label()"
          type="button"
          data-bs-toggle="dropdown"
          data-bs-popper-config='{"strategy":"fixed"}'
          aria-expanded="false"
        >
          <i [class]="icons.more"></i>
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class DataTableActionsComponent {
  protected icons = inject(RLB_ICONS);

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  /**
   * What the button that opens the menu is called.
   *
   * Its only content is a three-dots glyph, so without this a screen reader announces the button and
   * nothing else — on every row of the table, identically. A caller that knows what the row is can
   * say «Actions for Mario Rossi»; one that says nothing keeps the generic English word, as before.
   */
  label = input('Actions');

  public template = viewChild.required<TemplateRef<any>>('template');
  actions = contentChildren(DataTableActionComponent);

  _disabled() {
    if (this.disabled()) return true;
    const actions = this.actions();
    if (!actions || actions.length === 0) return false;
    return !actions.some(o => !o.disabled());
  }
}
