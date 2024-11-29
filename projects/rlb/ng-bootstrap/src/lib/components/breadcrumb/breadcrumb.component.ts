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
    <ol class="breadcrumb">
      <ng-container *ngFor="let item of items; last as last">
        <li class="breadcrumb-item" [ngClass]="{ active: !last }">
          <a *ngIf="!last" [href]="item.link || '#'">{{ item.label }}</a>
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
}
