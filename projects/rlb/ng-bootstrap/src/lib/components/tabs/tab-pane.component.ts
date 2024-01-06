import { Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'rlb-tab-pane',
  host: {
    class: 'tab-pane',
    '[class.active]': 'active',
    '[class.fade]': 'fade',
    '[attr.id]': 'id',
    tabindex: '0',
    role: 'tabpanel',
    '[attr.aria-labelledby]': 'id + "-rlb-tab"',
  },
  template: `<ng-content />`,
})
export class TabPaneComponent {
  @Input({ alias: 'id', required: true }) id!: string;
  @Input({ transform: booleanAttribute, alias: 'active' }) active?: boolean;
  @Input({ transform: booleanAttribute, alias: 'fade' }) fade?: boolean;
}
