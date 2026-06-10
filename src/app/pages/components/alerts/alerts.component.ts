import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class AlertsComponent {
  message: string = '';
  onDismiss() {
    this.message = 'Alert dismissed';
  }

  liveAlertsNumber: number = 0;
  get liveAlertsArray() {
    return Array.from({ length: this.liveAlertsNumber });
  }

  variantsExample = `<rlb-alert color="primary">This is a primary alert—check it out!</rlb-alert>
<rlb-alert color="secondary">This is a secondary alert—check it out!</rlb-alert>
<rlb-alert color="success">This is a success alert—check it out!</rlb-alert>
<rlb-alert color="danger">This is a danger alert—check it out!</rlb-alert>
<rlb-alert color="warning">This is a warning alert—check it out!</rlb-alert>
<rlb-alert color="info">This is a info alert—check it out!</rlb-alert>
<rlb-alert color="light">This is a light alert—check it out!</rlb-alert>
<rlb-alert color="dark">This is a dark alert—check it out!</rlb-alert>`;

  liveExample = `@for (n of liveAlertsArray; track n) {
  <rlb-alert [dismissible]="true" color="primary" class="fade show">
    This is a dismissible alert—check it out!
  </rlb-alert>
}
<button rlb-button (click)="liveAlertsNumber = liveAlertsNumber + 1">Show Live Alert</button>`;

  linkColorExample = `<rlb-alert color="primary">
  A simple primary alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="secondary">
  A simple secondary alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="success">
  A simple success alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="danger">
  A simple danger alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="warning">
  A simple warning alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="info">
  A simple info alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="light">
  A simple light alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>
<rlb-alert color="dark">
  A simple dark alert with <a href="#" class="alert-link">an example link</a>.
  Give it a click if you like.
</rlb-alert>`;

  additionalContentExample = `<rlb-alert color="success">
  <h4 class="alert-heading">Well done!</h4>
  <p>Aww yeah, you successfully read this important alert message. This example text is going to
    run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
  <hr>
  <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
</rlb-alert>`;

  iconsExample = `<rlb-alert color="info" class="fs-5">
  <i class="bi bi-exclamation-lg me-1"></i>
  An example alert with an icon
</rlb-alert>
<rlb-alert color="success" class="fs-5">
  <i class="bi bi-check-lg me-1"></i>
  An example alert with an icon
</rlb-alert>
<rlb-alert color="warning" class="fs-5">
  <i class="bi bi-exclamation-triangle-fill me-1"></i>
  An example alert with an icon
</rlb-alert>
<rlb-alert color="danger" class="fs-5">
  <i class="bi bi-x-lg me-1"></i>
  An example alert with an icon
</rlb-alert>`;

  dismissingExample = `<rlb-alert dismissible color="primary" class="fade show">
  <strong>Holy guacamole!</strong> You should check in on some of those fields below.
</rlb-alert>`;

  dismissedEventExample = `<p>{{ message }}</p>
<rlb-alert [dismissible]="true" (dismissed)="onDismiss()">
  Dismiss me to see the event fire.
</rlb-alert>`;

  api: DocApiRow[] = [
    {
      name: 'color',
      type: 'Color',
      default: "'primary'",
      description: 'Bootstrap contextual color of the alert (primary, secondary, success, danger, warning, info, light, dark).',
      kind: 'Input',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'false',
      description: 'When true, renders a close button in the top-right corner that dismisses the alert.',
      kind: 'Input',
    },
    {
      name: 'class',
      type: 'string',
      default: 'undefined',
      description: 'Additional CSS class string applied to the inner alert div (e.g. "fade show" for an animated alert).',
      kind: 'Input',
    },
    {
      name: 'dismissed',
      type: 'EventEmitter<void>',
      description: 'Emitted when the user clicks the close button (only available when dismissible is true).',
      kind: 'Output',
    },
  ];
}
