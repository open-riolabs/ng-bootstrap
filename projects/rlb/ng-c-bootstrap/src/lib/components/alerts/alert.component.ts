import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Alert } from './alert.data';

@Component({
  selector: 'rlb-c-alert',
  template: ` <ng-template #template>
    <rlb-alert [color]="data?.color || 'primary'"> {{ data?.text }}</rlb-alert>
  </ng-template>`,
})
export class AlertComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data?: Alert;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
