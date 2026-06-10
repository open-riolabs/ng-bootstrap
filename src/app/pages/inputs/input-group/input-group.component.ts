import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-input-group',
  templateUrl: './input-group.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class InputGroupsComponent {
  emailControl = new FormControl('', [Validators.required]);
  phoneControl = new FormControl('', [Validators.required]);

  basicExample = `<rlb-input-group validate>
  <rlb-input name="email" [formControl]="emailControl" placeholder="Email"></rlb-input>
  <rlb-input name="phone" [formControl]="phoneControl" placeholder="Phone"></rlb-input>
  <rlb-input-validation></rlb-input-validation>
</rlb-input-group>`;

  textModeExample = `<rlb-input-group text>
  <span>@</span>
</rlb-input-group>

<rlb-input-group text>
  <span>https://</span>
</rlb-input-group>`;

  sizeExample = `<rlb-input-group size="small">
  <rlb-input placeholder="Small group"></rlb-input>
</rlb-input-group>

<rlb-input-group>
  <rlb-input placeholder="Default group"></rlb-input>
</rlb-input-group>

<rlb-input-group size="large">
  <rlb-input placeholder="Large group"></rlb-input>
</rlb-input-group>`;

  api: DocApiRow[] = [
    {
      name: 'text',
      type: 'boolean',
      default: 'false',
      description: 'Renders the group as an input-group-text container for displaying plain text or icons instead of input fields.',
      kind: 'Input',
    },
    {
      name: 'validate',
      type: 'boolean',
      default: 'false',
      description: 'Enables grouped validation. Aggregates errors from all child rlb-input components and forwards them to an optional rlb-input-validation element placed inside the group.',
      kind: 'Input',
    },
    {
      name: 'size',
      type: "'small' | 'large' | undefined",
      default: 'undefined',
      description: "Controls the overall group size. 'small' applies input-group-sm; 'large' applies input-group-lg.",
      kind: 'Input',
    },
  ];
}
