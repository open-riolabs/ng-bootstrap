import { Component, input, OnDestroy, ViewChild } from '@angular/core';
import { BuilderComponent } from '../../shared/component-builder/builder.component';
import { ComponentHostDirective } from '../../shared/component-builder/component-host.directive';
import { InnerToastService } from './inner-toast.service';

@Component({
  selector: 'rlb-toast-container',
  template: `<ng-template component-host></ng-template>`,
  host: { class: 'toast-container' },
  standalone: false
})
export class ToastContainerComponent
  extends BuilderComponent<InnerToastService>
  implements OnDestroy {
  builderId = input.required<string>({ alias: 'id' });

  @ViewChild(ComponentHostDirective, { static: true }) component!: ComponentHostDirective;

  constructor(private toastService: InnerToastService) {
    super(toastService);
    this.toastService.registerBuilder(this);
  }

  ngOnDestroy(): void {
    this.toastService.removeBuilder(this.builderId());
  }
}
