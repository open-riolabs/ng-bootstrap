import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef, booleanAttribute } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      <a [routerLink]="!disabled ? url : undefined" class="item" 
         [class.active]="active" 
         routerLinkActive="active" 
         [class.disabled]="disabled"
         (click)="!disabled && isAction? emitAction($event): undefined"
          >
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

  get isAction() {
    return this.onAction.observers.length > 0;
  }

  @Input('label') label!: string;
  @Input('icon') icon?: string;
  @Input('url') url?: string;
  @Input({ transform: booleanAttribute, alias: 'active' }) active: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled: boolean = false;
  @Output('action') onAction = new EventEmitter<void>();

  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }

  emitAction(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.onAction.emit();
  }
}