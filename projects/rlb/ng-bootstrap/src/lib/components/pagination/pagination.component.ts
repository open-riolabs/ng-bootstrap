import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  contentChildren,
  input,
} from '@angular/core';
import { PaginationItemComponent } from './pagination-item.component';

@Component({
  selector: 'rlb-pagination',
  template: ` <ng-template #template>
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
  </ng-template>`,
  standalone: false
})
export class PaginationComponent implements OnInit {
  element!: HTMLElement;

  cssClass = input('', { alias: 'class' });
  size = input<'sm' | 'md' | 'lg' | undefined>(undefined);
  alignment = input<'start' | 'center' | 'end' | undefined>(undefined);

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  children = contentChildren(PaginationItemComponent);

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
