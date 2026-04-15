import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-tab-pane',
    host: {
        class: 'tab-pane',
        '[class.active]': 'active()',
        '[class.fade]': 'fade()',
        '[attr.id]': 'id()',
        tabindex: '0',
        role: 'tabpanel',
        '[attr.aria-labelledby]': 'id() + "-rlb-tab"',
    },
    template: `
    <ng-content />
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class TabPaneComponent {
  id = input.required<string>({ alias: 'id' });
  active = input(false, { alias: 'active', transform: booleanAttribute });
  fade = input(false, { alias: 'fade', transform: booleanAttribute });
}
