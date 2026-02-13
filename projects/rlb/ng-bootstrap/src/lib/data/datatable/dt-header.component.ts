import {
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'rlb-dt-header',
  template: `
    <ng-template #template>
      <th [class]="cssClass()" [style]="cssStyle()">
        <ng-content></ng-content>
      </th>
    </ng-template>`,
  standalone: false
})
export class DataTableHeaderComponent implements OnInit {
  field = input<string | undefined>(undefined);
  type = input<'number' | 'string' | undefined>(undefined);
  sortable = input(false, { transform: booleanAttribute });
  filtrable = input(false, { transform: booleanAttribute });
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
