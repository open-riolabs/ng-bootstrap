import {
  Component,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';

@Component({
    selector: 'rlb-dt-header',
    template: `
    <ng-template #template>
      <th [class]="cssClass" [style]="cssStyle">
        <ng-content></ng-content>
      </th>
    </ng-template>`,
    standalone: false
})
export class DataTableHeaderComponent {
  @Input() field!: string;
  @Input() type!: 'number' | 'string';
  @Input({ alias: 'sortable', transform: booleanAttribute }) sortable?: boolean;
  @Input({ alias: 'filtrable', transform: booleanAttribute }) filtrable?: boolean;
  @Input({ alias: 'class' }) cssClass?: string
  @Input({ alias: 'style' }) cssStyle?: string;

  element!: HTMLElement;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
