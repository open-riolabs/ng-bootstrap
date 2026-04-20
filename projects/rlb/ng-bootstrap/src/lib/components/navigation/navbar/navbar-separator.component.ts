import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
    selector: 'rlb-navbar-separator',
    template: `
    <ng-template #template>
      <li class="nav-item separator {{ cssClass() }}"></li>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarSeparatorComponent implements OnInit {
  element!: HTMLElement;

  cssClass = input('', { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
