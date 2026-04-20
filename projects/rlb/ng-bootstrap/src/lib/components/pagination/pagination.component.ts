import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { PaginationItemComponent } from './pagination-item.component';

@Component({
    selector: 'rlb-pagination',
    template: `
    <ng-template #template>
      <nav>
        <ul
          class="pagination {{ cssClass() }}"
          [class.pagination-sm]="size() === 'sm'"
          [class.pagination-lg]="size() === 'lg'"
          [class.justify-content-start]="alignment() === 'start'"
          [class.justify-content-center]="alignment() === 'center'"
          [class.justify-content-end]="alignment() === 'end'"
        >
          <ng-content select="rlb-pagination-item" />
        </ul>
      </nav>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnInit {
  element!: HTMLElement;

  cssClass = input('', { alias: 'class' });
  size = input<'sm' | 'md' | 'lg' | undefined>(undefined);
  alignment = input<'start' | 'center' | 'end' | undefined>(undefined);

  template = viewChild.required<TemplateRef<any>>('template');
  children = contentChildren(PaginationItemComponent);

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
