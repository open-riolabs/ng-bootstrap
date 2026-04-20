import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'rlb-button-toolbar',
    template: `<ng-content></ng-content>`,
    host: {
        class: 'btn-toolbar',
        'attr.role': 'toolbar',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonToolbarComponent {
  orientation = input<'horizontal' | 'vertical'>('horizontal', { alias: 'orientation' });
  size = input<'sm' | 'md' | 'lg'>('md', { alias: 'size' });
}
