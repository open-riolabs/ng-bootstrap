import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  input,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-separator',
  template: ` <ng-template #template>
    <li class="nav-item separator {{ cssClass() }}"></li>
  </ng-template>`,
  standalone: false
})
export class NavbarSeparatorComponent implements OnInit {
  element!: HTMLElement;

  cssClass = input('', { alias: 'class' });

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
