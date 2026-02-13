import {
  Component,
  EmbeddedViewRef,
  input,
  numberAttribute,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'rlb-dt-cell',
  template: `
    <ng-template #template>
      <td [colSpan]="colSpan()" [class]="cssClass()" [style]="cssStyle()">
        <ng-content></ng-content>
      </td>
    </ng-template>`,
  standalone: false
})
export class DataTableCellComponent implements OnInit {

  colSpan = input<number, unknown>(undefined, { alias: 'col-span', transform: numberAttribute });
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
