import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  OutputRefSubscription,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavbarItemComponent } from './navbar-item.component';

@Component({
  selector: 'rlb-navbar-items',
  template: `
    <ng-template #template>
      <ul
        class="navbar-nav {{ cssClass() }}"
        [class.navbar-nav-scroll]="scroll()"
        [style.--bs-scroll-height]="scroll()"
      >
        <ng-content
          select="rlb-navbar-item, rlb-navbar-dropdown-item, rlb-navbar-separator, ng-container"
        />
      </ul>
    </ng-template>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarItemsComponent implements OnInit, AfterContentInit, OnDestroy {
  scroll = input<string | undefined>(undefined);
  cssClass = input('', { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');
  element!: HTMLElement;

  menuItems = contentChildren(NavbarItemComponent, { descendants: true });

  click = output<MouseEvent>();

  private itemClickSubs: OutputRefSubscription[] = [];

  constructor(private viewContainerRef: ViewContainerRef) {
    effect(() => {
      this.itemClickSubs.forEach(s => s.unsubscribe());
      this.itemClickSubs = [];
      const items = this.menuItems();
      items.forEach(item => {
        this.itemClickSubs.push(item.click.subscribe(event => this.click.emit(event)));
      });
    });
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterContentInit() {
    // Migrated to effect()
  }

  ngOnDestroy() {
    this.itemClickSubs.forEach(s => s.unsubscribe());
  }
}
