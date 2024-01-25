import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-sidebar-footer',
  host: { class: 'pb-3 px-3' },
  template: `
    <ng-template #template>
      <div class="mb-2 {{ cssClass }}">
        <hr class="text-white ms-3 my-2" />
        <ng-content select="rlb-sidebar-item"></ng-content>
      </div>
    </ng-template>
  `,
})
export class SidebarFooterComponent {
  open: boolean = false;
  sidebarId: string = '';
  @Input({ alias: 'class' }) cssClass?: string = '';
  constructor(private viewContainerRef: ViewContainerRef) {}

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
