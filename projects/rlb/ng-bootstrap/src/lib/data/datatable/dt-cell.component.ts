import { Component, input, numberAttribute, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'rlb-dt-cell',
  template: `
    <ng-template #template>
      <td
        [colSpan]="colSpan()"
        [class]="cssClass()"
        [style]="cssStyle()"
      >
        <ng-content></ng-content>
      </td>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableCellComponent {
  colSpan = input<number, unknown>(undefined, { alias: 'col-span', transform: numberAttribute });
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });

  template = viewChild.required<TemplateRef<any>>('template');
}
