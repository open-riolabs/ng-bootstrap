import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavbarItemComponent } from "./navbar-item.component";
import { startWith, Subject, takeUntil } from "rxjs";

@Component({
    selector: 'rlb-navbar-items',
    template: ` <ng-template #template>
    <ul
      class="navbar-nav {{ cssClass }}"
      [class.navbar-nav-scroll]="scroll"
      [style.--bs-scroll-height]="scroll"
    >
      <ng-content
				select="rlb-navbar-item, rlb-navbar-dropdown-item, rlb-navbar-separator, ng-container"
      />
    </ul>
  </ng-template>`,
    standalone: false
})
export class NavbarItemsComponent implements OnInit, AfterContentInit, OnDestroy  {
  @Input({ alias: 'scroll' }) scroll?: string;
  @Input({ alias: 'class' }) cssClass?: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  @ContentChildren(NavbarItemComponent, { descendants: true })
  menuItems!: QueryList<NavbarItemComponent>;

  @Output() click = new EventEmitter<MouseEvent>();

  private destroy$ = new Subject<void>();

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterContentInit() {
    this.menuItems.changes.pipe(
      startWith(this.menuItems), // handles initial list
      takeUntil(this.destroy$)
    ).subscribe((items: QueryList<NavbarItemComponent>) => {
      items.forEach(item => {
        item.click.pipe(takeUntil(this.destroy$)).subscribe(event => this.click.emit(event));
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
