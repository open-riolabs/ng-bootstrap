import {
  Component,
  ContentChildren,
  QueryList,
  DoCheck,
  ViewChild,
  ViewContainerRef,
  EmbeddedViewRef,
  TemplateRef,
  Input,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';

@Component({
    selector: 'rlb-dt-row',
    template: `
    <ng-template #template>
      <tr [class]="cssClass" [style]="cssStyle">
        <ng-content select="rlb-dt-cell"></ng-content>
        <rlb-dt-cell *ngIf="hasActions">
          <ng-container #projectedActions></ng-container>
        </rlb-dt-cell>
      </tr>
    </ng-template>`,
    standalone: false
})
export class DataTableRowComponent implements DoCheck {
  @Input({ alias: 'class' }) cssClass?: string
  @Input({ alias: 'style' }) cssStyle?: string;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ViewChild('projectedActions', { read: ViewContainerRef }) _projectedActions!: ViewContainerRef;
  @ContentChildren(DataTableActionsComponent) public actionsBlock!: QueryList<DataTableActionsComponent>;

  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  get _view() {
    return this.temp
  }

  public get hasActions() {
    return !!this.actionsBlock && !!this.actionsBlock.first;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngDoCheck() {
    if (this.hasActions) {
      if (this._projectedActions) {
        for (let i = this._projectedActions.length; i > 0; i--) {
          this._projectedActions.detach();
        }
        this._projectedActions.insert(this.actionsBlock.first._view);
      }
    }
  }
}
