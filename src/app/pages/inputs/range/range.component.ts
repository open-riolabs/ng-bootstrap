import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class RangesComponent {
  basicControl = new FormControl(50);
  minMaxControl = new FormControl(30);
  stepControl = new FormControl(0);
  disabledControl = new FormControl({ value: 40, disabled: true });
  validationControl = new FormControl(null, [Validators.required]);

  basicExample = `<rlb-range [formControl]="basicControl"></rlb-range>`;

  minMaxExample = `<rlb-range [formControl]="minMaxControl" [min]="0" [max]="100"></rlb-range>`;

  stepExample = `<rlb-range [formControl]="stepControl" [min]="0" [max]="100" [step]="10"></rlb-range>`;

  disabledExample = `<rlb-range [formControl]="disabledControl" [disabled]="true"></rlb-range>`;

  readonlyExample = `<rlb-range [formControl]="basicControl" [readonly]="true"></rlb-range>`;

  customIdExample = `<rlb-range id="my-range" [formControl]="basicControl"></rlb-range>`;

  api: DocApiRow[] = [
    {
      name: 'id',
      type: 'string',
      default: "''",
      description: 'Custom id for the underlying input element. When omitted, an auto-generated unique id is used.',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the range slider. Also responds to the Angular forms disabled state set via the FormControl.',
      kind: 'Input',
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Makes the range slider read-only so the value cannot be changed by the user.',
      kind: 'Input',
    },
    {
      name: 'min',
      type: 'number',
      description: 'Minimum selectable value for the range slider.',
      kind: 'Input',
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum selectable value for the range slider.',
      kind: 'Input',
    },
    {
      name: 'step',
      type: 'number',
      description: 'Interval between selectable values (step size). When omitted the browser default (1) is used.',
      kind: 'Input',
    },
    {
      name: '[before]',
      type: 'ng-content',
      description: 'Content projected before the range input (e.g. a label or prefix icon).',
      kind: 'Content',
    },
    {
      name: '[after]',
      type: 'ng-content',
      description: 'Content projected after the range input (e.g. a suffix unit or action button).',
      kind: 'Content',
    },
  ];
}
