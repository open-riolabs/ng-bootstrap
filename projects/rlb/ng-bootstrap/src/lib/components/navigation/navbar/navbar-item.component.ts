import { Component, ElementRef, Input, DoCheck, Renderer2, AfterViewInit, ContentChildren, QueryList, ContentChild, booleanAttribute } from "@angular/core";
import { DropdownMenuItemComponent } from "../../dropdown/dropdown-menu-item.component";
import { DropdownContainerComponent } from "dist/rlb/ng-bootstrap";

@Component({
  selector: 'a[rlb-navbar-item]',
  template: `<ng-content></ng-content>`,
  host: {
    'class': 'nav-link',
    '[class.dropdown]': 'dropdown',
  }
})
export class NavbarItemComponent implements AfterViewInit {

  @Input() disabled: boolean = false;
  @Input({ transform: booleanAttribute }) dropdown: boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const cont = this.elementRef.nativeElement.parentNode;
    const li = this.renderer.createElement('li');
    this.renderer.addClass(li, 'nav-item');
    this.renderer.appendChild(li, this.elementRef.nativeElement);
    this.renderer.appendChild(cont, li);
  }
}
