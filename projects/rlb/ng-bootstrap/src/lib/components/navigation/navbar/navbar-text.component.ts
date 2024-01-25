import {
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  Input,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-text',
  template: ` <ng-template #template>
    <span class="navbar-text {{cssClass}}">
      <ng-content />
    </span>
  </ng-template>`,
})
export class NavbarTextComponent {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input({ alias: 'class' }) cssClass?: string = '';
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
