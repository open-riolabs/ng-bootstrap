import {
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';
import { SidebarHeaderComponent } from './sidebar-header.component';
import { SidebarFooterComponent } from './sidebar-footer.component';
import { SidebarItemComponent } from './sidebar-item.component';
import { SidebarSearchComponent } from './sidebar-search.component';

@Component({
  selector: 'rlb-sidebar',
  template: `
    <ng-template #template>
      <div
        class="rlb-sidebar {{cssClass}}"
        [style.width.px]="open ? maxWidth : width"
        [class.open]="open"
      >
        <button *ngIf="!hideCloseBtn" class="open-btn" (click)="openOnChange()">
          <i class="bi bi-arrow-right-short"></i>
        </button>
        <nav class="nav">
          <div>
            <ng-content select="rlb-sidebar-header"></ng-content>
            <ng-content select="rlb-sidebar-search"></ng-content>
            <div class="nav_list">
              <ng-content select="rlb-sidebar-item"></ng-content>
            </div>
          </div>
          <ng-content select="rlb-sidebar-footer"></ng-content>
        </nav>
      </div>
    </ng-template>
  `,
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input('id') id!: string;
  @Input('max-width') maxWidth: number = 250;
  @Input('width') width: number = 68;
  @Input({ transform: booleanAttribute, alias: 'open' }) open: boolean = false;
  @Output('openChange') openChange: EventEmitter<boolean> = new EventEmitter();
  @Input({ transform: booleanAttribute, alias: 'hide-close-btn' })
  @Input({ alias: 'class' }) cssClass?: string = '';
  hideCloseBtn: boolean = false;

  @ContentChild(SidebarHeaderComponent) public header!: SidebarHeaderComponent;
  @ContentChild(SidebarFooterComponent) public footer!: SidebarFooterComponent;
  @ContentChild(SidebarSearchComponent) public search!: SidebarSearchComponent;
  @ContentChildren(SidebarItemComponent)
  public items!: QueryList<SidebarItemComponent>;

  constructor(private viewContainerRef: ViewContainerRef) {}

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      if (this.header) this.header.open = changes['open'].currentValue;
      if (this.footer) this.footer.open = changes['open'].currentValue;
      if (this.items)
        this.items.forEach(
          (item) => (item.open = changes['open'].currentValue),
        );
      if (this.search) this.search.open = changes['open'].currentValue;
    }
    if (changes['id']) {
      if (this.header) this.header.sidebarId = changes['id'].currentValue;
      if (this.footer) this.footer.sidebarId = changes['id'].currentValue;
      if (this.items)
        this.items.forEach(
          (item) => (item.sidebarId = changes['id'].currentValue),
        );
      if (this.search) this.search.sidebarId = changes['id'].currentValue;
    }
  }

  openOnChange() {
    this.open = !this.open;
    if (this.header) this.header.open = this.open;
    if (this.footer) this.footer.open = this.open;
    if (this.items) this.items.forEach((item) => (item.open = this.open));
    if (this.search) this.search.open = this.open;
  }
}
