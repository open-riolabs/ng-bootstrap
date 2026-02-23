import {
  AfterContentInit,
  Component,
  contentChildren,
  effect,
  input,
  OnDestroy,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from "rxjs";
import { NavbarItemComponent } from "./navbar-item.component";

@Component({
  selector: 'rlb-navbar-items',
  template: ` <ng-template #template>
    <ul
      class="navbar-nav {{ cssClass() }}"
      [class.navbar-nav-scroll]="scroll()"
      [style.--bs-scroll-height]="scroll()"
    >
      <ng-content
				select="rlb-navbar-item, rlb-navbar-dropdown-item, rlb-navbar-separator, ng-container"
      />
    </ul>
  </ng-template>`,
  standalone: false
})
export class NavbarItemsComponent implements OnInit, AfterContentInit, OnDestroy {
  scroll = input<string | undefined>(undefined);
  cssClass = input('', { alias: 'class' });

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  menuItems = contentChildren(NavbarItemComponent, { descendants: true });

  click = output<MouseEvent>();

  private destroy$ = new Subject<void>();

  constructor(private viewContainerRef: ViewContainerRef) {
    effect(() => {
      const items = this.menuItems();
      items.forEach(item => {
        item.click.subscribe(event => this.click.emit(event));
      });
    });
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  ngAfterContentInit() {
    // Migrated to effect()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
