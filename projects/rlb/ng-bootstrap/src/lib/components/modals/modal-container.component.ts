import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { BuilderComponent } from '../../shared/component-builder/builder.component';
import { InnerModalService } from './inner-modal.service';
import { ComponentHostDirective } from '../../shared/component-builder/component-host.directive';
@Component({
    selector: 'rlb-modal-container',
    template: `<ng-template component-host></ng-template>`,
    standalone: false
})
export class ModalContainerComponent
  extends BuilderComponent<InnerModalService>
  implements OnDestroy {

  @Input({ alias: 'id' }) builderId!: string;

  @ViewChild(ComponentHostDirective, { static: true }) component!: ComponentHostDirective;

  constructor(private modalService: InnerModalService) {
    super(modalService);
    this.modalService.registerBuilder(this);
  }

  ngOnDestroy(): void {
    this.modalService.removeBuilder(this.builderId);
  }
}
