import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SidebarMode } from './sidebar-mode';

@Component({
  selector: 'rlb-sidebar-header',
  template: `
    <ng-template #template>
      <ng-container *ngIf="mode==='user'">
        user
      </ng-container>
      <ng-container *ngIf="mode==='logo'">
        <a href="#" class="logo">
          <i class='bx bx-layer icon'></i>
          <span class="name">BBBootstrap</span>
        </a>
      </ng-container>
      <ng-container *ngIf="mode==='custom'">
        <ng-content></ng-content>
      </ng-container>
    </ng-template>
  `
})
export class SidebarHeaderComponent implements OnInit {

  @Input('mode') mode!: SidebarMode;

  open: boolean = false;
  sidebarId: string = '';

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}