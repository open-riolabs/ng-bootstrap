import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class OptionsComponent {
  basicExample = `<rlb-select placeholder="Select an option">
  <rlb-option value="angular">Angular</rlb-option>
  <rlb-option value="react">React</rlb-option>
  <rlb-option value="vue">Vue</rlb-option>
</rlb-select>`;

  disabledExample = `<rlb-select placeholder="Select an option">
  <rlb-option value="angular">Angular</rlb-option>
  <rlb-option value="react" disabled>React (disabled)</rlb-option>
  <rlb-option value="vue">Vue</rlb-option>
</rlb-select>`;

  dynamicExample = `@for (item of items; track item.value) {
  <rlb-option [value]="item.value" [disabled]="item.disabled">
    {{ item.label }}
  </rlb-option>
}`;

  items = [
    { value: 'ts', label: 'TypeScript', disabled: false },
    { value: 'rxjs', label: 'RxJS', disabled: false },
    { value: 'ngrx', label: 'NgRx (unavailable)', disabled: true },
    { value: 'signals', label: 'Signals', disabled: false },
  ];

  api: DocApiRow[] = [
    {
      name: 'value',
      type: 'string | number | null | undefined',
      description: 'The value submitted to the parent select or radio group when this option is chosen.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'When true, the option is rendered as a disabled <option> element and cannot be selected.',
      kind: 'Input',
    },
  ];
}
