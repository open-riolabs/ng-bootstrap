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
  numberAttribute,
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
        class="border-end rlb-sidebar {{ cssClass }}"
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
  element!: HTMLElement;

  @Input({ alias: 'id' }) id!: string;
  @Input({ alias: 'max-width', transform: numberAttribute }) maxWidth: number = 250;
  @Input({ alias: 'width', transform: numberAttribute }) width: number = 68;
  @Input({ alias: 'open', transform: booleanAttribute }) open: boolean = false;
  @Input({ alias: 'hide-close-btn', transform: booleanAttribute }) hideCloseBtn?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';

  @Output('openChange') openChange: EventEmitter<boolean> = new EventEmitter();

  @ContentChild(SidebarHeaderComponent) public header!: SidebarHeaderComponent;
  @ContentChild(SidebarFooterComponent) public footer!: SidebarFooterComponent;
  @ContentChild(SidebarSearchComponent) public search!: SidebarSearchComponent;
  @ContentChildren(SidebarItemComponent) public items!: QueryList<SidebarItemComponent>;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

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
