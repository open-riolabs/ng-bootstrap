import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './pagionation.component.html',
})
export class PaginationsComponent {

  align = `<rlb-pagination [alignment]="'center'">
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
  size = `<rlb-pagination [size]="'sm'">
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
  isIcon = `<rlb-pagination>
    <rlb-pagination-item isIcon>1</rlb-pagination-item> 
  </rlb-pagination>`;
  disabled = `<rlb-pagination>
  <rlb-pagination-item isIcon [disabled]="true">1</rlb-pagination-item> 
</rlb-pagination>`;
  active = `<rlb-pagination>
  <rlb-pagination-item isIcon [active]="true">1</rlb-pagination-item> 
</rlb-pagination>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './pagination.component.html',
})
export class PagionationsComponent {}`;
}
