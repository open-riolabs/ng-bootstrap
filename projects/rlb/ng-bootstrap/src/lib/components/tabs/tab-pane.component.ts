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
    standalone: false
})
export class TabPaneComponent {
  @Input({ alias: 'id', required: true }) id!: string;
  @Input({ alias: 'active', transform: booleanAttribute }) active?: boolean;
  @Input({ alias: 'fade', transform: booleanAttribute }) fade?: boolean;
}
