import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-progress',
  template: `
    <div
      class="progress-bar {{ color && !infinite? 'bg-' + color : '' }} {{ textColor? 'text-' + textColor : '' }}"
      [class.progress-bar-animated]="animated"
      [class.progress-bar-striped]="striped"
      [class.infinite-progress]="infinite"
      [style.background-color]="infinite? 'unset' : null"
      [style.width.%]="infinite? max :getPercentValue()">
      <div *ngIf="infinite" class="inner bg-{{color}}"></div>
      <span *ngIf="showValue; else e">
        {{ getPercentValue() }}
      </span>
      <ng-template #e>
        <ng-content></ng-content>
      </ng-template>
    </div>`,
  host: {
    class: 'progress',
    'attr.role': 'progressbar',
    '[attr.aria-valuenow]': 'getPercentValue()',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuemin]': 'min',
    '[attr.aria-label]': 'ariaLabel',
    '[style.height.px]': 'height',
  },
})
export class ProgressComponent {
  showValue?: boolean = false;

  @Input({ alias: 'max', transform: numberAttribute }) max: number = 100;
  @Input({ alias: 'min', transform: numberAttribute }) min: number = 0;
  @Input({ alias: 'value', transform: numberAttribute }) value = 0;
  @Input({ alias: 'height', transform: numberAttribute }) height!: number;
  @Input({ alias: 'animated', transform: booleanAttribute }) animated?: boolean = false;
  @Input({ alias: 'striped', transform: booleanAttribute }) striped?: boolean = false;
  @Input({ alias: 'infinite', transform: booleanAttribute }) infinite?: boolean = false;
  @Input({ alias: 'aria-label' }) ariaLabel!: string;
  @Input({ alias: 'showValue', transform: booleanAttribute })
  @Input({ alias: 'color' }) color: Color = 'primary';
  @Input({ alias: 'text-color' }) textColor!: Color;

  getPercentValue() {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }
}
