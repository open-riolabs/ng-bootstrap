import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      <a [routerLink]="!disabled ? url : undefined" class="item" 
         [class.active]="active" 
         routerLinkActive="active" 
         [class.disabled]="disabled"
         (click)="!disabled && action ? action():undefined" >
        <i *ngIf="icon" [class]='icon'></i>
        <span class="name">
          <ng-content></ng-content>    
      </span>
      </a>
    </ng-template>
    `
})
export class SidebarItemComponent implements OnInit {

  open: boolean = false;
  sidebarId: string = '';

  @Input('label') label!: string;
  @Input('icon') icon?: string;
  @Input('url') url?: string;
  @Input('active') active: boolean = false;
  @Input('disabled') disabled: boolean = false;
  @Input('action') action!: (() => void | Promise<void> | Observable<void>) | null | undefined;

  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}