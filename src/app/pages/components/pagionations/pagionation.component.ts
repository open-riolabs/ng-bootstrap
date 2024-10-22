import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './pagionation.component.html',
})
export class PaginationsComponent {

  html: string = `<rlb-pagination [alignment]="'center'">
  <rlb-pagination-item [isIcon]="true" [active]="true">
    <span>&laquo;</span>
  </rlb-pagination-item>
  <rlb-pagination-item>1</rlb-pagination-item>
  <rlb-pagination-item>2</rlb-pagination-item>
  <rlb-pagination-item>3</rlb-pagination-item>
  <rlb-pagination-item>4</rlb-pagination-item>

  <rlb-pagination-item [isIcon]="true" [active]="true">
    <span>&raquo;</span>
  </rlb-pagination-item>
</rlb-pagination>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './pagination.component.html',
})
export class PagionationsComponent {}`;
}
