import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Breadcrumb } from './breadcrumb.data';

@Component({
    selector: 'rlb-c-breadcrumb',
    template: ` <ng-template #template>
    <rlb-breadcrumb [divider]="data?.divider" [items]="data?.items" />
  </ng-template>`,
    standalone: false
})
export class BreadcrumbComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Breadcrumb | undefined;
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
