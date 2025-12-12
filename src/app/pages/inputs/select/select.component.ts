import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'app-select',
    templateUrl: './select.component.html',
    standalone: false
})
export class SelectsComponent {
	
	form: FormGroup;
	
	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			select: ['', Validators.required],
		})
	}
	html: string = `
<rlb-select></rlb-select>`;
}
