import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';
import { Subscription } from "rxjs";

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
export class DataTableRowComponent implements AfterViewInit, OnInit, AfterContentInit, OnDestroy {
  @Input({ alias: 'class' }) cssClass?: string
  @Input({ alias: 'style' }) cssStyle?: string;
  hasActions: boolean = true

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ViewChild('projectedActions', { read: ViewContainerRef }) _projectedActions!: ViewContainerRef;
  @ContentChildren(DataTableActionsComponent) public actionsBlock!: QueryList<DataTableActionsComponent>;

  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;
  private _actionsBlockSubscription: Subscription | undefined;

  constructor(private viewContainerRef: ViewContainerRef) { }

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

  ngAfterContentInit() {
    this._actionsBlockSubscription = this.actionsBlock.changes.subscribe(() => {
      this._renderActions();
    });
    this.hasActions = !!this.actionsBlock.length;
  }

  ngAfterViewInit() {
    this._renderActions();
  }

  ngOnDestroy() {
    if (this._actionsBlockSubscription) {
      this._actionsBlockSubscription.unsubscribe();
    }
  }

  private _renderActions() {
    if (this.hasActions && this._projectedActions) {
      for (let i = this._projectedActions.length; i > 0; i--) {
        this._projectedActions.detach();
      }
      if (this.actionsBlock.first) {
        this._projectedActions.insert(this.actionsBlock.first._view);
      }
    }
  }
}
