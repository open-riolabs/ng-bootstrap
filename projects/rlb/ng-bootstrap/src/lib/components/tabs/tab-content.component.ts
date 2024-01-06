import { Component, Input } from '@angular/core';

@Component({
  selector: 'rlb-tab-content',
  host: { class: 'tab-content' },
  template: `<ng-content select="rlb-tab-pane" />`,
})
export class TabContentComponent {}
