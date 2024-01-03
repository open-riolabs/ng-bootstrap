import { Component, ViewContainerRef, Input, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: 'rlb-navbar-items',
  template: `
    <ng-template #template>
      <ul [class]="'navbar-nav '+ classList" [class.navbar-nav-scroll]="scroll" [style.--bs-scroll-height]="scroll" >
        <ng-content select="rlb-navbar-item, rlb-navbar-separator" />
      </ul>
    </ng-template>`,
})
export class NavbarItemsComponent {
  @Input() scroll!: string;
  @Input('class') classList!: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}