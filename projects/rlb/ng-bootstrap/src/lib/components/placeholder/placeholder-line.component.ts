import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-placeholder-line',
    template: ``,
    host: {
        '[class]': 'hostClasses()',
        '[style.width]': 'width()',
        '[style.height]': 'height() ?? null',
        '[style.display]': '"block"',
        '[style.margin-bottom]': '"0.5rem"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class RlbPlaceholderLineComponent {
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md');
  color = input('secondary');
  width = input('100%');
  height = input<string | undefined>('1.5rem');
  rounded = input(true);

  hostClasses = computed(() => {
    const classes = ['placeholder', `bg-${this.color()}`];

    if (this.size() !== 'md') {
      classes.push(`placeholder-${this.size()}`);
    }

    if (this.rounded()) {
      classes.push('rounded');
    }

    return classes.join(' ');
  });
}
