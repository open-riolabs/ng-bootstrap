import { Directive, ElementRef, Renderer2, Input, DoCheck, ViewContainerRef, Host, Self, Optional } from "@angular/core";

import { ButtonToolbarComponent } from "./boutton-toolbar.component";
import { SidebarItemComponent } from "../sidebar/sidebar-item.component";

@Directive({
  selector: `
    button[toggle],
    a[toggle],
    rlb-sidebar-item[toggle],
    rlb-button-toolbar[toogle]`,
})
export class ToggleDirective implements DoCheck {
  @Input('toggle') toggle!: 'offcanvas' | 'collapse' | 'tab' | 'pill' | 'dropdown' | 'buttons-group'
  @Input({ alias: 'toggle-target', required: true }) target!: string;
  @Input() collapsed: boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2,
    @Host() @Self() @Optional() public sidebarItem: SidebarItemComponent,
    @Host() @Self() @Optional() public buttonToolbar: ButtonToolbarComponent,
  ) { }

  ngDoCheck() {
    let element: HTMLElement | undefined = undefined;
    if (this.sidebarItem) {
      element = this.sidebarItem.element;
    } else if (this.buttonToolbar) {
      element = this.elementRef.nativeElement;
    } else {
      element = this.elementRef.nativeElement;
    }

    this.renderer.setAttribute(element, 'data-bs-toggle', this.toggle);
    if (element?.nodeName.toLowerCase() === 'a') {
      this.renderer.setAttribute(element, 'href', `#${this.target}`);
    } else {
      this.renderer.setAttribute(element, 'data-bs-target', `#${this.target}`);
    }
    if (this.collapsed) {
      this.renderer.addClass(element, 'collapsed');
      this.renderer.setAttribute(element, 'aria-expanded', 'true');
    } else {
      this.renderer.removeClass(element, 'collapsed');
      this.renderer.setAttribute(element, 'aria-expanded', 'false');
    }
    this.renderer.setAttribute(element, 'aria-controls', this.target);
    this.renderer.setAttribute(element, 'aria-expanded', 'false');
  }
}
