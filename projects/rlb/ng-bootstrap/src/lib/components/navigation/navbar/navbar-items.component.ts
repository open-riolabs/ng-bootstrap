import {
  Component,
  ViewContainerRef,
  Input,
  TemplateRef,
  ViewChild,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-items',
  template: ` <ng-template #template>
    <ul
      class="navbar-nav {{ cssClass }}"
      [class.navbar-nav-scroll]="scroll"
      [style.--bs-scroll-height]="scroll"
    >
      <ng-content
        select="rlb-navbar-item, rlb-navbar-separator, ng-container"
      />
    </ul>
  </ng-template>`,
})
export class NavbarItemsComponent implements OnInit {
  @Input({ alias: 'scroll' }) scroll?: string;
  @Input({ alias: 'class' }) cssClass?: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
