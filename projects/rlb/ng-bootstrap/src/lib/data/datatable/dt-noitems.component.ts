import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
    selector: 'rlb-dt-noitems',
    template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableNoItemsComponent {
  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  constructor() {}
}
