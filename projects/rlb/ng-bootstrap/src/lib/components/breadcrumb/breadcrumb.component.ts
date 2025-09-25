import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
    selector: 'rlb-breadcrumb',
    template: ` <nav
    aria-label="breadcrumb"
    style="--bs-breadcrumb-divider: '{{ divider }}';"
  >
			<ol class="breadcrumb" [ngClass]="cssClasses">
      <ng-container *ngFor="let item of items; last as last">
        <li class="breadcrumb-item" [ngClass]="{ active: !last }">
					<a *ngIf="!last" [routerLink]="item.link || '#'">{{ item.label }}</a>
          <span *ngIf="last">{{ item.label }}</span>
        </li>
      </ng-container>
    </ol>
  </nav>`,
    standalone: false
})
export class BreadcrumbComponent {
  @Input({ alias: 'divider' }) divider?: string = '>';
  @Input({ alias: 'items' }) items?: BreadcrumbItem[] = [];
	@Input({ alias: 'cssClasses' }) cssClasses: string = '';
}
