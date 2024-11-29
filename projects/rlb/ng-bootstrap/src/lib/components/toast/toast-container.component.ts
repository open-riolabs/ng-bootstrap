import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { BuilderComponent } from '../../shared/component-builder/builder.component';
import { InnerToastService } from './inner-toast.service';
import { ComponentHostDirective } from '../../shared/component-builder/component-host.directive';
import { ToastData } from './data/toast-data';

@Component({
    selector: 'rlb-toast-container',
    template: `<ng-template component-host></ng-template>`,
    host: { class: 'toast-container' },
    standalone: false
})
export class ToastContainerComponent
  extends BuilderComponent<InnerToastService>
  implements OnDestroy {
  @Input({ alias: 'id', required: true }) builderId!: string;

  @ViewChild(ComponentHostDirective, { static: true }) component!: ComponentHostDirective;

  constructor(private toastService: InnerToastService) {
    super(toastService);
    this.toastService.registerBuilder(this);
  }

  ngOnDestroy(): void {
    this.toastService.removeBuilder(this.builderId);
  }
}
