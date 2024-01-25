import {
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-separator',
  template: ` <ng-template #template>
    <li class="nav-item separator {{ cssClass }}"></li>
  </ng-template>`,
})
export class NavbarSeparatorComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  @Input({ alias: 'class' }) cssClass?: string = '';
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
