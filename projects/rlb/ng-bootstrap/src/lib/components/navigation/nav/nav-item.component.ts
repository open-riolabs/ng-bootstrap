import { Component, Input, ViewContainerRef, OnInit, ViewChild, TemplateRef, QueryList, ContentChildren, DoCheck } from '@angular/core'
import { UniqueIdService } from '../../../shared/unique-id.service';

@Component({
  selector: 'rlb-nav-item',
  template: `
  <ng-template #template>
    <li class="nav-item"
      [class.w-100]="view==='responsive' || view === 'expand'">
      <ng-container *ngIf="!isContainer; else container">
        <a [routerLink]="href" routerLinkActive="active" class="nav-link align-middle px-0 py-0 ">
          <i *ngIf="icon" [class]="icon"></i>
          <span
            [class.d-none]="view === 'responsive' || view === 'shrink'"
            [class.d-sm-inline]="view === 'responsive'"
            [class.d-inline]="view === 'expand'">
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </span>
        </a>
      </ng-container>
      <ng-template #container>
        <a toggle="collapse" [toggle-target]="'nav-menu'+id">
          <i *ngIf="icon" [class]="icon"></i>
          <span
            [class.d-none]="view === 'responsive' || view === 'shrink'"
            [class.d-sm-inline]="view === 'responsive'"
            [class.d-inline]="view === 'expand'">
            <ng-content select="[rlb-nav-title]"></ng-content>
          </span>
        </a>
        <ul 
          class="collapse show nav flex-column py-0"
          [id]="'nav-menu'+id" 
          [class.ps-3]="view === 'expand'"
          [class.ps-sm-3]="view === 'responsive'">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </ul>
      </ng-template>    
      <ng-template #content><ng-content /></ng-template>
    </li>
  </ng-template>`
})
export class NavItemComponent implements OnInit, DoCheck {
  @Input() href?: string | any[] | null | undefined = '#';
  @Input() icon?: string = '';
  isContainer!: boolean;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;
  @ContentChildren(NavItemComponent) children!: QueryList<NavItemComponent>;

  public view: 'shrink' | 'expand' | 'responsive' = 'responsive';

  private _id: string
  public get id() {
    return this._id
  }

  constructor(private viewContainerRef: ViewContainerRef, private idService: UniqueIdService) {
    this._id = idService.id
  }

  ngDoCheck(): void {
    this.isContainer = this.children?.length > 0;
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}