import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-dropdown',
    template: `
    <ng-content select="a[rlb-dropdown], button[rlb-dropdown]" />
    <ng-content select="[rlb-dropdown-menu], rlb-dropdown-container" />
  `,
    host: {
        '[class.dropdown]': 'direction() === "down"',
        '[class.dropdown-center]': 'direction() === "down-center"',
        '[class.dropup]': 'direction() === "up" || direction() === "up-center"',
        '[class.dropup-center]': 'direction() === "up-center"',
        '[class.dropstart]': 'direction() === "left"',
        '[class.dropend]': 'direction() === "right"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class DropdownComponent {
  direction = input<'up' | 'down' | 'left' | 'right' | 'up-center' | 'down-center'>('down', {
    alias: 'direction',
  });
}
