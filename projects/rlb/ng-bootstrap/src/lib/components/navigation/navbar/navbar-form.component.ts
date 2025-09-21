import { Component, Input, TemplateRef, ViewChild, ViewContainerRef, } from '@angular/core';

@Component({
    selector: 'rlb-navbar-form',
    template: ` <ng-template #template>
			<form [attr.role]="role" class="d-flex ms-lg-auto mb-2 mb-lg-0 {{ cssClass }}">
      <ng-content />
    </form>
  </ng-template>`,
    standalone: false
})
export class NavbarFormComponent {
  element!: HTMLElement;

  @Input({ alias: 'role' }) role!: string;
  @Input({ alias: 'class' }) cssClass?: string = '';

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
