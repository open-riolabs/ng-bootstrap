import {
  DoCheck,
  Component,
  EmbeddedViewRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DynamicWrapper } from './dynamic-wrapper';

@Component({
  selector: 'rlb-wrapped-component',
  template: `
    <ng-template #portal>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class WrappedComponent implements DynamicWrapper, DoCheck, OnDestroy {
  _dynamic = false;

  @ViewChild('portal') templateRef!: TemplateRef<void>;
  componentView!: EmbeddedViewRef<void>; // the component projected view (in memory)

  ngDoCheck() {
    // Create the inner components in memory, not the DOM.
    this.componentView = this.templateRef.createEmbeddedView();
  }

  ngOnDestroy() {
    this.componentView.destroy();
  }
}
