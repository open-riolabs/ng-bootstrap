import { Component, Input, ViewContainerRef, OnInit, ViewChild, TemplateRef, QueryList, ContentChildren } from '@angular/core'
import { PaginationItemComponent } from './pagination-item.component';

@Component({
  selector: 'rlb-pagination',
  template: `
  <ng-template #template>
    <nav>
      <ul class="pagination" 
        [class.pagination-sm]="size === 'sm'"
        [class.pagination-lg]="size === 'lg'"
        [class.justify-content-start]="alignment === 'start'"
        [class.justify-content-center]="alignment === 'center'"
        [class.justify-content-end]="alignment === 'end'">
        <ng-content select="rlb-pagination-item" />
      </ul>
    </nav>
  </ng-template>`
})
export class PaginationComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ContentChildren(PaginationItemComponent) children!: QueryList<PaginationItemComponent>;

  @Input() size?: 'sm' | 'md' | 'lg';
  @Input() alignment?: 'start' | 'center' | 'end';

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}