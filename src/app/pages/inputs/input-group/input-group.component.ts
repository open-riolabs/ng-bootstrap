import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'app-input-group',
    templateUrl: './input-group.component.html',
    standalone: false
})
export class InputGroupsComponent {

	html: string = `
<rlb-input-group validate>
  <rlb-input name="email" [formControl]="emailControl" placeholder="Email"></rlb-input>
  <rlb-input name="phone" [formControl]="phoneControl" placeholder="Phone"></rlb-input>
  <rlb-input-validation></rlb-input-validation>
</rlb-input-group>`;

	ts = `
@Component({
selector: 'app-alerts',
templateUrl: './alerts.component.html',
 styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
    emailControl = new FormControl('', [Validators.required]);
	phoneControl = new FormControl('', [Validators.required]);
}`

	emailControl = new FormControl('', [Validators.required]);
	phoneControl = new FormControl('', [Validators.required]);

}
