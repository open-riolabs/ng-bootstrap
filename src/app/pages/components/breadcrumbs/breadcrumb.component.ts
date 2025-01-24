import { Component } from '@angular/core';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    standalone: false
})
export class BreadcrumbsComponent {

  sample: string = `<rlb-breadcrumb [items]="[{ label: 'Home', link: '/home' },{ label: 'Breadcrumb' }]"></rlb-breadcrumb>`;

  divider: string = `<rlb-breadcrumb [divider]="'-'" [items]="[{ label: 'Home', link: '/home' },{ label: 'Breadcrumb' }]"></rlb-breadcrumb>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbsComponent {}`;
}
