import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {

  
  message: string = '';
  onDismiss() {
    this.message = 'Alert dismissed';
  }

  color: string = `<rlb-alert [color]="'primary'">Ciao!</rlb-alert>
<rlb-alert [color]="'secondary'">Ciao!</rlb-alert>
<rlb-alert [color]="'success'">Ciao!</rlb-alert>
<rlb-alert [color]="'danger'">Ciao!</rlb-alert>
<rlb-alert [color]="'warning'">Ciao!</rlb-alert>
<rlb-alert [color]="'info'">Ciao!</rlb-alert>
<rlb-alert [color]="'light'">Ciao!</rlb-alert>
<rlb-alert [color]="'dark'">Ciao!</rlb-alert>`;

  dismissable: string = `<rlb-alert [dismissible]="true">Ciao!</rlb-alert>`;

  dismissed: string = `<p>{{message}}</p>
<rlb-alert [dismissible]="true" (dismissed)="onDismiss()">Ciao!</rlb-alert>`;

  ts: string = `@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  message: string = '';
  onDismiss() {
    this.message = 'Alert dismissed';
  }
}`;
}
