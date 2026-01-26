import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  id: string;
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
      @for (item of items; track item.link; let last = $last) {
        <li class="breadcrumb-item" [ngClass]="{ active: !last }">
          @if (!last) {
            <a [routerLink]="item.link">{{ item.label }}</a>
          }
          @if (last) {
            <span>{{ item.label }}</span>
          }
        </li>
      }
    </ol>
  </nav>`,
  standalone: false,
})
export class BreadcrumbComponent {
  @Input({ alias: 'divider' }) divider?: string = '>';
  @Input({ alias: 'items' }) items?: BreadcrumbItem[] = [];
  @Input({ alias: 'cssClasses' }) cssClasses: string = '';
}
