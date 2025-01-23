import { booleanAttribute, Component, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      <li *ngIf="title" class="menu-title">{{ title }}</li>
      <li *ngIf="!title">
        <a *ngIf="children?.length" href="javascript:void(0);" class="is-parent has-arrow">
          <i *ngIf="icon" [class]="icon"></i>
          <span>{{ label }}</span>
        </a>
        <ul class="sub-menu" aria-expanded="false">
          <ng-content select="rlb-sidebar-item"></ng-content>
        </ul>
        <a *ngIf="!children?.length" [routerLink]="link" class="side-nav-link-ref" routerLinkActive="active">
          <i *ngIf="icon" [class]="icon"></i>
          <ng-content></ng-content>
        </a>
      </li>
    </ng-template>
  `,
  standalone: false
})
export class SidebarItemComponent implements OnInit {

  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() link: any[] | string | null | undefined;
  @Input({ alias: 'container', transform: booleanAttribute }) container: boolean = false;
  @ContentChildren(SidebarItemComponent) children!: QueryList<SidebarItemComponent>;

  element!: HTMLElement;
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