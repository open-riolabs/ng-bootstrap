import { booleanAttribute, Component, input } from '@angular/core';

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
  template: `<ng-content />`,
  standalone: false
})
export class TabPaneComponent {
  id = input.required<string>({ alias: 'id' });
  active = input(false, { alias: 'active', transform: booleanAttribute });
  fade = input(false, { alias: 'fade', transform: booleanAttribute });
}
