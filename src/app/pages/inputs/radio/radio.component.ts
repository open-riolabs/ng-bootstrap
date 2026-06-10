import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class RadiosComponent {
  value: string = '1';

  basicExample = `<rlb-radio [(ngModel)]="value">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2">Option 2</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-radio>`;

  disabledExample = `<rlb-radio [(ngModel)]="value" [disabled]="true">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2">Option 2</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-radio>`;

  readonlyExample = `<rlb-radio [(ngModel)]="value" [readonly]="true">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2">Option 2</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-radio>`;

  disabledOptionExample = `<rlb-radio [(ngModel)]="value">
  <rlb-option value="1">Option 1</rlb-option>
  <rlb-option value="2" [disabled]="true">Option 2 (disabled)</rlb-option>
  <rlb-option value="3">Option 3</rlb-option>
</rlb-radio>`;

  radioApi: DocApiRow[] = [
    { name: 'id', type: 'string', default: 'auto-generated', description: 'Sets a unique identifier for the radio group. When omitted, a unique id is generated automatically.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all radio buttons in the group. The user cannot change the selection.', kind: 'Input' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes all radio buttons in the group read-only. The current selection is displayed but cannot be changed.', kind: 'Input' },
    { name: 'value', type: 'string | undefined', default: 'undefined', description: 'The currently selected value. Updated automatically when the user selects an option.', kind: 'Two-way' },
  ];

  optionApi: DocApiRow[] = [
    { name: 'value', type: 'string | number | null | undefined', description: 'The value submitted to the form when this option is selected.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this individual option so it cannot be selected.', kind: 'Input' },
  ];
}
