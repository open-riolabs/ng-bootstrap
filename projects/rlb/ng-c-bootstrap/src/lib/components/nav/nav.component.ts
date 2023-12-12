import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Nav } from './nav.data';

@Component({
  selector: 'rlb-c-navbar',
  template: `
  <ng-template #template>
      <rlb-nav
        [horizontalAlignment]="data?.horizontalAlignment"
        [vertical]="data?.vertical"
        [view]="data?.view"
        [fill]="data?.fill">
      <rlb-nav-item 
        *ngFor="let item of data?.items || []"
        [icon]="item?.icon"
        [href]="item?.link">
        {{item?.text}}
      </rlb-nav-item>
    </rlb-nav>
  </ng-template>`
})
export class NavComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Nav | undefined;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}
