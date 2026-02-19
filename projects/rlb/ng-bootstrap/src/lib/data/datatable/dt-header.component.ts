import {
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'rlb-dt-header',
  template: `
    <ng-template #template>
      <th
        [class]="cssClass()"
        [style]="cssStyle()"
      >
        <ng-content></ng-content>
      </th>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableHeaderComponent {
  field = input<string | undefined>(undefined);
  type = input<'number' | 'string' | undefined>(undefined);
  sortable = input(false, { transform: booleanAttribute });
  filtrable = input(false, { transform: booleanAttribute });
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  constructor() {}
}
