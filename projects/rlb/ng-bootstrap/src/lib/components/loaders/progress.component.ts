import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-progress',
  template: ` <div
    class="progress-bar {{ color && !infinite? 'bg-' + color : '' }} {{ textColor? 'text-' + textColor : '' }}"
    [class.progress-bar-animated]="animated"
    [class.progress-bar-striped]="striped"
    [class.infinite-progress]="infinite"
    [style.width.%]="infinite? max :getPercentValue()"
  >
    <div *ngIf="infinite" class="inner bg-primary"></div>
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
  @Input({ alias: 'max', transform: numberAttribute }) max: number = 100;
  @Input({ alias: 'min', transform: numberAttribute }) min: number = 0;
  @Input({ alias: 'value', transform: numberAttribute }) value = 0;
  @Input({ alias: 'height', transform: numberAttribute }) height!: number;
  @Input({ transform: booleanAttribute, alias: 'animated' }) animated?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'striped' }) striped?: boolean = false;
  @Input({ transform: booleanAttribute }) infinite?: boolean = false;
  @Input() ariaLabel!: string;
  @Input({ transform: booleanAttribute, alias: 'showValue' })
  showValue?: boolean = false;
  @Input() color: Color = 'primary';
  @Input() textColor!: Color;

  getPercentValue() {
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }
}
