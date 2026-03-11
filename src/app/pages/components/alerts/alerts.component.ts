import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  standalone: false
})
export class AlertsComponent {
  message: string = '';
  onDismiss() {
    this.message = 'Alert dismissed';
  }

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code);
  }

  liveAlertsNumber: number = 0;
  get liveAlertsArray() {
    return Array.from({ length: this.liveAlertsNumber });
  }

  alertVariants: string = `
<rlb-alert color='primary'>This is a primary alert—check it out!</rlb-alert>
<rlb-alert color='secondary'>This is a secondary alert—check it out!</rlb-alert>
<rlb-alert color='success'>This is a success alert—check it out!</rlb-alert>
<rlb-alert color='danger'>This is a danger alert—check it out!</rlb-alert>
<rlb-alert color='warning'>This is a warning alert—check it out!</rlb-alert>
<rlb-alert color='info'>This is a info alert—check it out!</rlb-alert>
<rlb-alert color='light'>This is a light alert—check it out!</rlb-alert>
<rlb-alert color='dark'>This is a dark alert—check it out!</rlb-alert>
`;


  alertLinkVariants: string = `
<rlb-alert color='primary'>
  A simple primary alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='secondary'>
  A simple secondary alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='success'>
  A simple success alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='danger'>
  A simple danger alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='warning'>
  A simple warning alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='info'>
  A simple info alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='light'>
  A simple light alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
<rlb-alert color='dark'>
  A simple dark alert with 
  <a href="#" class="alert-link"> an example link</a>. 
  Give it a click if you like.
</rlb-alert>
`;

  additionalContentAlert: string = `
  <rlb-alert color="success">
    <h4 class="alert-heading">Well done!</h4>
    <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer
      so that you can see how spacing within an alert works with this kind of content.</p>
    <hr>
    <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
  </rlb-alert>`;

  alertWithIcon: string = `
  <rlb-alert color="info">
    <i class="bi bi-exclamation-lg me-1"></i>
    An example alert with an icon
  </rlb-alert>
  <rlb-alert color="success">
    <i class="bi bi-check-lg me-1"></i>
    An example alert with an icon
  </rlb-alert>
  <rlb-alert color="warning">
    <i class="bi bi-exclamation-triangle-fill me-1"></i>
    An example alert with an icon
  </rlb-alert>
  <rlb-alert color="danger">
    <i class="bi bi-x-lg me-1"></i>
    An example alert with an icon
  </rlb-alert>
  `;

  dismissingAlert: string = `
  <rlb-alert dismissible color='primary' class="fade show">
    <strong>Holy guacamole!</strong> You should check in on some of those fields below.
  </rlb-alert>
  `;


  dismissable: string = `<rlb-alert [dismissible]="true">Ciao!</rlb-alert>`;

  dismissed: string = `<p>{{message}}</p>
<rlb-alert [dismissible]="true" (dismissed)="onDismiss()">Ciao!</rlb-alert>`;

  implementationExample: string = `
@Component({
  imports: [RlbAppModule],
  selector: 'app-alerts',
  template: \`
    <rlb-alert dismissible color='primary' class="fade show" (dismissed)="onDismiss()">
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
    </rlb-alert>
  \`,
})
export class ExampleComponent {
  onDismiss() {
    //add your logic here
  }
}
`;

}