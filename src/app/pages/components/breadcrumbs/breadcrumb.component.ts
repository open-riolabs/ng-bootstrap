import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class BreadcrumbsComponent {
  basicExample = `<rlb-breadcrumb
  [items]="[
    { id: '1', label: 'Home', link: '/home' },
    { id: '2', label: 'Library', link: '/library' },
    { id: '3', label: 'Data' }
  ]">
</rlb-breadcrumb>`;

  dividerExample = `<rlb-breadcrumb
  divider="-"
  [items]="[
    { id: '1', label: 'Home', link: '/home' },
    { id: '2', label: 'Library', link: '/library' },
    { id: '3', label: 'Data' }
  ]">
</rlb-breadcrumb>`;

  cssClassesExample = `<rlb-breadcrumb
  cssClasses="fs-5"
  [items]="[
    { id: '1', label: 'Home', link: '/home' },
    { id: '2', label: 'Styled' }
  ]">
</rlb-breadcrumb>`;

  api: DocApiRow[] = [
    {
      name: 'items',
      type: 'BreadcrumbItem[]',
      default: '[]',
      description: 'Array of breadcrumb items that define the navigation path. Each item requires an id and label; supply a link to make the item a navigable anchor.',
      kind: 'Input',
    },
    {
      name: 'divider',
      type: 'string',
      default: "'>'",
      description: 'Character or string used as the separator between breadcrumb items. Mapped to the Bootstrap CSS custom property --bs-breadcrumb-divider.',
      kind: 'Input',
    },
    {
      name: 'cssClasses',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes applied to the inner <ol> breadcrumb list element.',
      kind: 'Input',
    },
  ];
}
