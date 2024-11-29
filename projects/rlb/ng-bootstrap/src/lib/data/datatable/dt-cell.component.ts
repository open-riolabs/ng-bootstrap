import { Component, EmbeddedViewRef, Input, TemplateRef, ViewChild, ViewContainerRef, numberAttribute } from '@angular/core';

@Component({
    selector: 'rlb-dt-cell',
    template: `
    <ng-template #template>
      <td [colSpan]="colSpan" [class]="cssClass" [style]="cssStyle">
        <ng-content></ng-content>
      </td>
    </ng-template>`,
    standalone: false
})
export class DataTableCellComponent {

  @Input({ alias: 'col-span', transform: numberAttribute }) colSpan?: string;
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
