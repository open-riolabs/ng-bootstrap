import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Navbar } from './navbar.data';

@Component({
  selector: 'rlb-c-navbar',
  template: `
  <ng-template #template>
      <rlb-navbar 
        [color]="data?.color"
        [placement]="data?.placement"
        [expand]="data?.expand"
        [dark]="data?.dark">
      <a class="d-block d-sm-none" rlb-button href="#" toggle="collapse" toggle-target="sidebar" [outline]="true">
        <span class="navbar-toggler-icon"></span>
      </a>
      <a *ngIf="data?.brand" rlb-navbar-brand [routerLink]="data?.brand?.link">{{ data?.brand?.text}}</a>
      <rlb-navbar-items class="me-auto">
        <a *ngFor="let item of data?.items || []" rlb-navbar-item [routerLink]="item?.link" routerLinkActive="active">{{item.text}}</a>
      </rlb-navbar-items>
      <!-- <rlb-navbar-form>
        <rlb-input />
        <button rlb-button [outline]="true" color="primary" [size]="'sm'">Search</button>
      </rlb-navbar-form> -->
      <rlb-navbar-text *ngFor="let text of data?.text || []">
        {{text}}
      </rlb-navbar-text>
    </rlb-navbar>
  </ng-template>`
})
export class NavbarComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Navbar | undefined;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}
