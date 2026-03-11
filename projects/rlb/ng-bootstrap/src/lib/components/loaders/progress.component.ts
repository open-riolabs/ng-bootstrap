import { booleanAttribute, Component, computed, input, numberAttribute } from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-progress',
  template: `
    <div
      class="progress-bar {{ color() && !infinite()? 'bg-' + color() : '' }} {{ textColor()? 'text-' + textColor() : '' }}"
      [class.progress-bar-animated]="animated()"
      [class.progress-bar-striped]="striped()"
      [class.infinite-progress]="infinite()"
      [style.background-color]="infinite()? 'unset' : null"
      [style.width.%]="infinite()? max() : percentValue()">
      @if (infinite()) {
        <div class="inner bg-{{color()}}"></div>
      }
      @if (showValue()) {
        <span>
          {{ percentValue() }}
        </span>
      } @else {
        <ng-content></ng-content>
      }
    </div>`,
  host: {
    class: 'progress',
    'attr.role': 'progressbar',
    '[attr.aria-valuenow]': 'percentValue()',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuemin]': 'min()',
    '[attr.aria-label]': 'ariaLabel()',
    '[style.height.px]': 'height()',
  },
  standalone: false
})
export class ProgressComponent {

  max = input(100, { alias: 'max', transform: numberAttribute });
  min = input(0, { alias: 'min', transform: numberAttribute });
  value = input(0, { alias: 'value', transform: numberAttribute });
  height = input<number | undefined, unknown>(undefined, { alias: 'height', transform: numberAttribute });
  animated = input(false, { alias: 'animated', transform: booleanAttribute });
  striped = input(false, { alias: 'striped', transform: booleanAttribute });
  infinite = input(false, { alias: 'infinite', transform: booleanAttribute });
  ariaLabel = input<string | undefined>(undefined, { alias: 'aria-label' });
  showValue = input(false, { alias: 'showValue', transform: booleanAttribute });
  color = input<Color>('primary', { alias: 'color' });
  textColor = input<Color | undefined>(undefined, { alias: 'text-color' });

  percentValue = computed(() => {
    return ((this.value() - this.min()) / (this.max() - this.min())) * 100;
  });
}
