import {
  AfterViewChecked,
  booleanAttribute,
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
import { DataTableActionComponent } from './dt-action.component';
import { Subscription } from "rxjs";

@Component({
    selector: 'rlb-dt-actions',
    template: `
    <ng-template #template>
      <div class="dropdown">
        <button
            class="btn btn-outline py-0 pe-2 float-end"
            [disabled]="_disabled"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false">
          <i class="bi bi-three-dots"></i>
        </button>
        <ul class="dropdown-menu">
          <ng-container #projectedActions></ng-container>
        </ul>
      </div>

    </ng-template>
  `,
    standalone: false
})
export class DataTableActionsComponent implements OnInit, AfterViewChecked, OnDestroy {
  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;

  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ContentChildren(DataTableActionComponent) actions!: QueryList<DataTableActionComponent>;
  @ViewChild('projectedActions', { read: ViewContainerRef }) _projectedActions!: ViewContainerRef;
  private _actionsSubscription: Subscription | undefined;

  constructor(private viewContainerRef: ViewContainerRef) { }

  get _disabled() {
    if (this.disabled) return true;
    if (!this.actions || this.actions.length === 0) return false;
    return !this.actions.toArray().some((o) => !o.disabled);
  }

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

  ngAfterViewChecked() {
    this._renderActions();
  }

  ngOnDestroy() {
    if (this._actionsSubscription) {
      this._actionsSubscription.unsubscribe();
    }
  }

  private _renderActions() {
    if (this._projectedActions && this.actions) {
      for (let i = this._projectedActions?.length; i > 0; i--) {
        this._projectedActions.detach();
      }
      this.actions?.forEach((action) => {
        this._projectedActions.insert(action._view);
      });
    }
  }

}
