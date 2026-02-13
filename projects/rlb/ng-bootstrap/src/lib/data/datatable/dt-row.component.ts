import {
  Component,
  computed,
  contentChildren,
  effect,
  EmbeddedViewRef,
  input,
  OnInit,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableActionsComponent } from './dt-actions.component';

@Component({
  selector: 'rlb-dt-row',
  template: `
    <ng-template #template>
      <tr [class]="cssClass()" [style]="cssStyle()" (click)="rowClick.emit($event)">
        <ng-content select="rlb-dt-cell"></ng-content>
        @if (hasActions()) {
          <rlb-dt-cell>
            <ng-container #projectedActions></ng-container>
          </rlb-dt-cell>
        }
      </tr>
    </ng-template>`,
  standalone: false
})
export class DataTableRowComponent implements OnInit {
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });

  rowClick = output<MouseEvent>();

  template = viewChild.required<TemplateRef<any>>('template');
  _projectedActions = viewChild<ViewContainerRef>('projectedActions');
  actionsBlock = contentChildren(DataTableActionsComponent);

  element!: HTMLElement;
  private temp!: EmbeddedViewRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) {
    effect(() => {
      this._renderActions();
    });
  }

  get _view() {
    return this.temp;
  }

  hasActions = computed(() => {
    return this.actionsBlock().length > 0;
  });

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  private _renderActions() {
    const projectedActions = this._projectedActions();
    const actions = this.actionsBlock();
    if (this.hasActions() && projectedActions) {
      for (let i = projectedActions.length; i > 0; i--) {
        projectedActions.detach();
      }
      const firstAction = actions[0];
      if (firstAction) {
        projectedActions.insert(firstAction._view);
      }
    }
  }
}
