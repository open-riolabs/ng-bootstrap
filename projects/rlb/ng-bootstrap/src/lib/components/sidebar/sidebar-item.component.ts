import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef, booleanAttribute, } from '@angular/core';

@Component({
    selector: 'rlb-sidebar-item',
    template: `
    <ng-template #template>
      <a
        [routerLink]="!disabled ? url : undefined"
        class="item {{ cssClass }}"
        [class.active]="active"
        routerLinkActive="active"
        [class.disabled]="disabled"
        (click)="!disabled && isAction ? emitAction($event) : undefined"
      >
        <i *ngIf="icon" [class]="icon"></i>
        <span class="name">
          <ng-content></ng-content>
        </span>
      </a>
    </ng-template>
  `,
    standalone: false
})
export class SidebarItemComponent implements OnInit {
  element!: HTMLElement;
  open: boolean = false;
  sidebarId: string = '';

  get isAction() {
    return this.onAction.observers.length > 0;
  }

  @Input({ alias: 'label' }) label?: string;
  @Input({ alias: 'icon' }) icon?: string;
  @Input({ alias: 'url' }) url?: string;
  @Input({ alias: 'active', transform: booleanAttribute, }) active?: boolean;
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';

  @Output('action') onAction = new EventEmitter<void>();
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  emitAction(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.onAction.emit();
  }
}
