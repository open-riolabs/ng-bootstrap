import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {

  onDismiss() {
    console.log('dismissed');
  }

  html: string = `<div class="container mt-3">
  <rlb-alert [color]="'success'" dismissible (dismissed)="onDismiss()">Ciao!</rlb-alert>
</div>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './alerts.component.html',
})
export class AlertsComponent {}`;
}
