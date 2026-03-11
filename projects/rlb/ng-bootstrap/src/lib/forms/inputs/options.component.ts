import { booleanAttribute, Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'rlb-option',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>

    <!-- wrap the content in an <option> tag for SelectComponent -->
    <ng-template #element>
      <option
        [value]="value()"
        [disabled]="disabled()"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </option>
    </ng-template>
  `,
  standalone: false,
})
export class OptionComponent {
  value = input<string | number | null | undefined>();
  disabled = input(false, { transform: booleanAttribute });

  // 'template' is used by SelectComponent (contains <option> tag)
  template = viewChild.required<TemplateRef<any>>('element');

  contentTemplate = viewChild.required<TemplateRef<any>>('content');
}
