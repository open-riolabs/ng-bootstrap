import { ChangeDetectionStrategy, Component, input, OnDestroy, viewChild } from '@angular/core';
import { BuilderComponent } from '../../shared/component-builder/builder.component';
import { ComponentHostDirective } from '../../shared/component-builder/component-host.directive';
import { InnerModalService } from './inner-modal.service';

@Component({
  selector: 'rlb-modal-container',
  template: `
    <ng-template component-host></ng-template>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent
  extends BuilderComponent<InnerModalService>
  implements OnDestroy
{
  builderId = input.required<string>({ alias: 'id' });

  component = viewChild.required(ComponentHostDirective);

  constructor(private modalService: InnerModalService) {
    super(modalService);
    this.modalService.registerBuilder(this);
  }

  ngOnDestroy(): void {
    this.modalService.removeBuilder(this.builderId());
  }
}
