import { Component, input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  id: string;
  label: string;
  link?: string;
}

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'rlb-breadcrumb',
    template: ` <nav
    aria-label="breadcrumb"
    style="--bs-breadcrumb-divider: '{{ divider() }}';"
  >
    <ol class="breadcrumb" [class]="cssClasses()">
      @for (item of items(); track item.link; let last = $last) {
        <li class="breadcrumb-item" [class.active]="!last">
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
    imports: [RouterLink],
})
export class BreadcrumbComponent {
  divider = input('>', { alias: 'divider' });
  items = input<BreadcrumbItem[]>([], { alias: 'items' });
  cssClasses = input('', { alias: 'cssClasses' });
}
