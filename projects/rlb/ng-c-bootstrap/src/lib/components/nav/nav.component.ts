import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Nav } from './nav.data';

@Component({
    selector: 'rlb-c-navbar',
    template: ` <ng-template #template>
    <rlb-nav
      [horizontalAlignment]="data?.horizontalAlignment"
      [vertical]="data?.vertical"
      [view]="data?.view"
      [fill]="data?.fill"
    >
      <rlb-nav-item
        *ngFor="let item of data?.items || []"
        [icon]="item?.icon"
        [href]="item?.link"
      >
        {{ item?.text }}
      </rlb-nav-item>
    </rlb-nav>
  </ng-template>`,
    standalone: false
})
export class NavComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Nav | undefined;
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
