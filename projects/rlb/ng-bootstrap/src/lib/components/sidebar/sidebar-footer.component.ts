import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rlb-sidebar-footer',
  host: { 'class': 'pb-3 px-3' },
  template: `
    <ng-template #template>
      <div class="mb-2">
        <hr class="text-white ms-3 my-2" />
        <ng-content></ng-content> 
      </div>
    </ng-template>
    `
})
export class SidebarFooterComponent {

  open: boolean = false;
  sidebarId: string = '';

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}