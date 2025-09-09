import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { UniqueIdService } from "../../shared/unique-id.service";
import { Router } from "@angular/router";
import { CollapseComponent } from "../collapse/collapse.component";


@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
			<li *ngIf="title" (click)="click.emit($event)" class="menu-title" [ngClass]="responsiveClasses">{{ title }}</li>
			<li *ngIf="!title" (click)="click.emit($event)" [ngClass]="responsiveClasses">
        <a *ngIf="children?.length" href="javascript:void(0);" class="is-parent has-arrow" toggle="collapse" [toggle-target]="'side-item' + _id">
          <i *ngIf="icon" [class]="icon"></i>
          <span>{{ label }}</span>
        </a>
        <rlb-collapse [id]="'side-item' + _id">
          <ul class="sub-menu" aria-expanded="false">
            <ng-content select="rlb-sidebar-item"></ng-content>
          </ul>
        </rlb-collapse>
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
  element!: HTMLElement;
  @Input() title?: string | undefined;
  @Input() icon?: string | undefined;
  @Input() label?: string | undefined;
  @Input() link?: any[] | string | null | undefined;
  @Input() responsiveClasses?: string;
  
  @Output() click = new EventEmitter<MouseEvent>();

  @ContentChildren(SidebarItemComponent) children!: QueryList<SidebarItemComponent>;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
	@ViewChild(CollapseComponent) collapseComponent?: CollapseComponent;

  constructor(
    private viewContainerRef: ViewContainerRef,
		private uniqueIdService: UniqueIdService,
		private router: Router
  ) { }

  _id: string = '';

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
    this._id = this.uniqueIdService.id;
  }
}