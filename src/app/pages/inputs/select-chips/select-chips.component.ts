import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-select-chips',
  templateUrl: './select-chips.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class SelectChipsDocComponent {
  readonly languages = ['Italiano', 'English', 'Français', 'Deutsch', 'Español', 'Português', '日本語'];

  readonly picked = signal<string[]>(['Italiano', 'English']);
  readonly manyPicked = signal<string[]>(['Italiano', 'English', 'Français', 'Deutsch', 'Español']);
  readonly disabledPicked = signal<string[]>(['Italiano']);

  readonly reactive = new FormControl<string[]>(['English']);

  basicExample = `<rlb-select-chips
  [options]="languages"
  [(ngModel)]="picked"
/>`;

  overflowExample = `<!-- Beyond maxVisible the rest collapse into "(+N others)". -->
<rlb-select-chips
  [options]="languages"
  [maxVisible]="2"
  [(ngModel)]="picked"
/>`;

  placeholderExample = `<rlb-select-chips
  [options]="languages"
  placeholder="Pick your languages"
  [(ngModel)]="picked"
/>`;

  disabledExample = `<rlb-select-chips
  [options]="languages"
  disabled
  [(ngModel)]="picked"
/>`;

  reactiveExample = `readonly reactive = new FormControl<string[]>(['English']);

<rlb-select-chips [options]="languages" [formControl]="reactive" />`;

  api: DocApiRow[] = [
    { name: 'options', type: 'string[] | undefined', default: 'undefined', description: 'The values that can be chosen. The control only offers what is in this list — it does not accept free text.', kind: 'Input' },
    { name: 'placeholder', type: 'string', default: "'Add...'", description: 'Shown while nothing is selected.', kind: 'Input' },
    { name: 'maxVisible', type: 'number', default: '4', description: 'How many chips to render inline before collapsing the rest into "(+N others)". Keeps the control one line tall however much is selected.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control. Reactive forms can also disable it through the FormControl.', kind: 'Input' },
    { name: 'id', type: 'string', default: "''", description: 'Id for the control. One is generated when this is left out.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'string[]', description: 'The selected values. The component is a ControlValueAccessor, so it works with both forms APIs.', kind: 'Two-way' },
    { name: 'toggleOption(value)', type: 'void', description: 'Adds the value if missing, removes it if present.', kind: 'Method' },
  ];
}
