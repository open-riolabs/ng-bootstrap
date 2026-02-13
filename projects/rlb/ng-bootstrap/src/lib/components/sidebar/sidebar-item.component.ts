import {
  Component,
  contentChildren,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { UniqueIdService } from '../../shared/unique-id.service';
import { CollapseComponent } from '../collapse/collapse.component';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'rlb-sidebar-item',
  template: `
    <ng-template #template>
      @if (title()) {
        <li (click)="onItemClick($event)" class="menu-title">{{ title() }}</li>
      }
      @if (!title()) {
        <li (click)="onItemClick($event)">
          @if (children().length) {
            <a
              [badge]="
                badgeCounter() && badgeCounter()! > 0
                  ? badgeCounter()!.toString()
                  : undefined
              "
              href="javascript:void(0);"
              class="is-parent has-arrow"
              toggle="collapse"
              [toggle-target]="'side-item' + _id"
            >
              @if (icon()) {
                <i [class]="icon()"></i>
              }
              <span>{{ label() }}</span>
            </a>
          }
          <rlb-collapse [id]="'side-item' + _id">
            <ul class="sub-menu" aria-expanded="false">
              <ng-content select="rlb-sidebar-item"></ng-content>
            </ul>
          </rlb-collapse>
          @if (!children().length) {
            <a
              [routerLink]="link()"
              [badge]="
                badgeCounter() && badgeCounter()! > 0
                  ? badgeCounter()
                  : undefined
              "
              class="side-nav-link-ref"
              routerLinkActive="active"
            >
              @if (icon()) {
                <i [class]="icon()"></i>
              }
              <ng-content></ng-content>
            </a>
          }
        </li>
      }
    </ng-template>
  `,
  standalone: false,
})
export class SidebarItemComponent implements OnInit {
  element!: HTMLElement;
  title = input<string | undefined>(undefined);
  icon = input<string | undefined>(undefined);
  label = input<string | undefined>(undefined);
  link = input<any[] | string | null | undefined>(undefined);
  badgeCounter = input<number | undefined>(undefined);

  click = output<MouseEvent>();

  children = contentChildren(SidebarItemComponent);
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  collapseComponent = ViewChild(CollapseComponent);

  constructor(
    private viewContainerRef: ViewContainerRef,
    private uniqueIdService: UniqueIdService,
    private router: Router,
    private sidebarService: SidebarService,
  ) {}

  _id: string = '';

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
    this._id = this.uniqueIdService.id;
  }

  onItemClick(event: MouseEvent) {
    event.stopPropagation();
    this.click.emit(event);

    if (!this.title() && this.children().length === 0) {
      this.sidebarService.notifyItemClicked();
    }
  }
}
