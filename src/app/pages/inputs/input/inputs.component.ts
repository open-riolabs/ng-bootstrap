import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-input',
    templateUrl: './inputs.component.html',
    standalone: false
})
export class InputsComponent {

  html: string = `<rlb-input></rlb-input>`;
	form!: FormGroup;
	
	constructor(private fb: FormBuilder) {
		this.form = fb.group({
			input: ['', Validators.required],
		})
	}
}
