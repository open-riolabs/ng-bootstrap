import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbsComponent {

  html: string = `<rlb-breadcrumb [divider]="'/'" [items]="[{ label: 'Home', link: '/home' },{ label: 'Breadcrumb' }]"></rlb-breadcrumb>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbsComponent {}`;
}
