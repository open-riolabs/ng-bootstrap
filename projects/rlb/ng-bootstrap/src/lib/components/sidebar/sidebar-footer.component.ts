import { Component, Input } from '@angular/core';

@Component({
  selector: 'rlb-sidebar-footer',
  host: { 'class': 'pb-3 px-3' },
  template: `
    <hr class="text-white" />
    <ng-content></ng-content>
    `
})
export class SidebarFooterComponent { 

  open: boolean = false;
  sidebarId: string = '';

  constructor() { }

}