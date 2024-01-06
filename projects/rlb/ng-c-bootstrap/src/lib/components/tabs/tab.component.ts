import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Tab } from './tab.data';

@Component({
  selector: 'rlb-c-tab',
  template: ` <ng-template #template>
    <rlb-tabs
      [horizontal-alignment]="data?.horizontalAlignment"
      [view]="data?.view"
      [vertical]="data?.vertical"
      [fill]="data?.fill"
      [class]="data?.class"
    >
      <rlb-tab *ngFor="let item of data?.items || []" [target]="item.id">{{
        item.title
      }}</rlb-tab>
    </rlb-tabs>
    <rlb-tab-content>
      <rlb-tab-pane *ngFor="let item of data?.items || []" [id]="item.id">{{
        item.text
      }}</rlb-tab-pane>
    </rlb-tab-content>
  </ng-template>`,
})
export class TabComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Tab | undefined;
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
