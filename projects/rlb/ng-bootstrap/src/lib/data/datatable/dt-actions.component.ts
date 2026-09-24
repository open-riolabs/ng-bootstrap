import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RLB_ICONS } from '../../shared/icons';
import { DataTableActionComponent } from './dt-action.component';
import { NgTemplateOutlet } from '@angular/common';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { DropdownContainerComponent } from '../../components/dropdown/dropdown-container.component';
import { DropdownDirective } from '../../components/dropdown/dropdown.directive';

@Component({
    selector: 'rlb-dt-actions',
    template: `
    <ng-template #template>
      <rlb-dropdown>
        <button
          rlb-dropdown
          class="btn btn-outline py-0 pe-2 float-end"
          [disabled]="_disabled()"
          [attr.aria-label]="labelText()"
          type="button"
        >
          <i [class]="icons.more" aria-hidden="true"></i>
        </button>
        <ul rlb-dropdown-menu placement="right">
          <!-- Delegate rendering to Angular instead of manual ViewContainerRef manipulation -->
          @for (action of actions(); track $index) {
            <ng-container *ngTemplateOutlet="action.template()"></ng-container>
          }
        </ul>
      </rlb-dropdown>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, DropdownComponent, DropdownDirective, DropdownContainerComponent],
})
export class DataTableActionsComponent {
  protected icons = inject(RLB_ICONS);
  private defaults = inject(RLB_DEFAULTS).table;

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  /**
   * What the button that opens the menu is called.
   *
   * Its only content is a three-dots glyph, so without this a screen reader announces the button and
   * nothing else — on every row of the table, identically. A caller that knows what the row is can
   * say «Actions for Mario Rossi»; one that says nothing keeps the generic English word, as before.
   */
  label = input<string | undefined>(undefined);

  protected labelText = computed(() => this.label() ?? this.defaults.actionsLabel);

  public template = viewChild.required<TemplateRef<any>>('template');
  actions = contentChildren(DataTableActionComponent);

  _disabled() {
    if (this.disabled()) return true;
    const actions = this.actions();
    if (!actions || actions.length === 0) return false;
    return !actions.some(o => !o.disabled());
  }
}
