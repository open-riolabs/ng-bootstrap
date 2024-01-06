import {
  Component,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  Input,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-form',
  template: ` <ng-template #template>
    <form [attr.role]="role" class="d-flex">
      <ng-content />
    </form>
  </ng-template>`,
})
export class NavbarFormComponent {
  @Input() role!: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
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
