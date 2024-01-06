import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { BuilderComponent } from '../../shared/component-builder/builder.component';
import { InnerToastService } from './inner-toast.service';
import { ComponentHostDirective } from '../../shared/component-builder/component-host.directive';
import { ToastData } from './data/toast-data';

@Component({
  selector: 'rlb-toast-container',
  template: `<ng-template component-host></ng-template>`,
  host: { class: 'toast-container' },
})
export class ToastContainerComponent
  extends BuilderComponent<InnerToastService>
  implements OnDestroy
{
  @ViewChild(ComponentHostDirective, { static: true })
  component!: ComponentHostDirective;
  @Input({ alias: 'id', required: true }) builderId!: string;

  constructor(private toastService: InnerToastService) {
    super(toastService);
    this.toastService.registerBuilder(this);
  }

  ngOnDestroy(): void {
    this.toastService.removeBuilder(this.builderId);
  }
}
