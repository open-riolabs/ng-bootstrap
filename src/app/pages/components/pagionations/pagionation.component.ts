import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-pagionations',
  templateUrl: './pagionation.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class PaginationsComponent {
  selectedPage = signal(1);

  alignmentExample = `<rlb-pagination [alignment]="'center'">
  <rlb-pagination-item isIcon>
    <span>&laquo;</span>
  </rlb-pagination-item>
  <rlb-pagination-item isIcon>1</rlb-pagination-item>
  <rlb-pagination-item isIcon>2</rlb-pagination-item>
  <rlb-pagination-item isIcon>3</rlb-pagination-item>
  <rlb-pagination-item isIcon>4</rlb-pagination-item>
  <rlb-pagination-item isIcon>
    <span>&raquo;</span>
  </rlb-pagination-item>
</rlb-pagination>`;

  sizesExample = `<rlb-pagination [size]="'sm'">
  <rlb-pagination-item isIcon>
    <span>&laquo;</span>
  </rlb-pagination-item>
  <rlb-pagination-item isIcon>1</rlb-pagination-item>
  <rlb-pagination-item isIcon>2</rlb-pagination-item>
  <rlb-pagination-item isIcon>3</rlb-pagination-item>
  <rlb-pagination-item isIcon>4</rlb-pagination-item>
  <rlb-pagination-item isIcon>
    <span>&raquo;</span>
  </rlb-pagination-item>
</rlb-pagination>
<rlb-pagination [size]="'md'">
  <rlb-pagination-item isIcon>
    <span>&laquo;</span>
  </rlb-pagination-item>
  <rlb-pagination-item isIcon>1</rlb-pagination-item>
  <rlb-pagination-item isIcon>2</rlb-pagination-item>
  <rlb-pagination-item isIcon>3</rlb-pagination-item>
  <rlb-pagination-item isIcon>4</rlb-pagination-item>
  <rlb-pagination-item isIcon>
    <span>&raquo;</span>
  </rlb-pagination-item>
</rlb-pagination>
<rlb-pagination [size]="'lg'">
  <rlb-pagination-item isIcon>
    <span>&laquo;</span>
  </rlb-pagination-item>
  <rlb-pagination-item isIcon>1</rlb-pagination-item>
  <rlb-pagination-item isIcon>2</rlb-pagination-item>
  <rlb-pagination-item isIcon>3</rlb-pagination-item>
  <rlb-pagination-item isIcon>4</rlb-pagination-item>
  <rlb-pagination-item isIcon>
    <span>&raquo;</span>
  </rlb-pagination-item>
</rlb-pagination>`;

  disabledExample = `<rlb-pagination>
  <rlb-pagination-item isIcon [disabled]="true">1</rlb-pagination-item>
</rlb-pagination>`;

  activeExample = `<rlb-pagination>
  <rlb-pagination-item isIcon [active]="true">1</rlb-pagination-item>
</rlb-pagination>`;

  itemClickExample = `<rlb-pagination [alignment]="'center'">
  @for (p of [1, 2, 3, 4, 5]; track p) {
    <rlb-pagination-item
      isIcon
      [active]="p === selectedPage()"
      (itemClick)="selectedPage.set(p)">
      {{ p }}
    </rlb-pagination-item>
  }
</rlb-pagination>`;

  paginationApi: DocApiRow[] = [
    { name: 'class', type: 'string', default: "''", description: 'Extra CSS class(es) added to the inner <ul> element.', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: 'undefined', description: 'Controls the Bootstrap pagination size variant. Omit for the default (md) size.', kind: 'Input' },
    { name: 'alignment', type: "'start' | 'center' | 'end'", default: 'undefined', description: 'Horizontal alignment of the pagination list. Omit for the default start alignment.', kind: 'Input' },
  ];

  paginationItemApi: DocApiRow[] = [
    { name: 'isIcon', type: 'boolean', default: 'false', description: 'Renders the item as an icon/symbol page link (e.g. prev/next arrows). Accepts boolean attribute shorthand.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Marks the item as disabled; blocks click events and sets aria-disabled.', kind: 'Input' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Marks the item as the currently active page; sets aria-current="page".', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Extra CSS class(es) added to the inner <li> element.', kind: 'Input' },
    { name: 'itemClick', type: 'void', description: 'Emitted when the item is activated by click or keyboard (Enter / Space). Does not emit when the item is disabled.', kind: 'Output' },
  ];
}
