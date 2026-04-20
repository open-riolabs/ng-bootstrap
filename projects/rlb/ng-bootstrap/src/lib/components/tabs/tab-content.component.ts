import { Component, Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
    selector: 'rlb-tab-content',
    host: { class: 'tab-content' },
    template: `
    <ng-content select="rlb-tab-pane" />
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabContentComponent {}
