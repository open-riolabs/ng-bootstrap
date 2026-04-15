import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  imports: [SHARED_IMPORTS],
})
export class SelectsComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      select: ['', Validators.required],
    });
  }
  html: string = `
<rlb-select></rlb-select>`;
}
