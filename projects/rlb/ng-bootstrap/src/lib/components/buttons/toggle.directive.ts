import { Directive, ElementRef, Renderer2, Input, DoCheck, Host, Self, Optional, booleanAttribute } from '@angular/core';
import { ButtonToolbarComponent } from './boutton-toolbar.component';
import { SidebarItemComponent } from '../sidebar/sidebar-item.component';

@Directive({
    selector: `
    button[toggle],
    a[toggle],
    rlb-navbar-item[toggle],
    rlb-sidebar-item[toggle],
    rlb-button-toolbar[toogle]`,
    standalone: false
})
export class ToggleDirective implements DoCheck {
  @Input({ alias: 'toggle', required: true }) toggle?: 'offcanvas' | 'collapse' | 'tab' | 'pill' | 'dropdown' | 'buttons-group';
  @Input({ alias: 'toggle-target', required: true }) target!: string;
  @Input({ transform: booleanAttribute, alias: 'collapsed' }) collapsed?: boolean;
  @Input({ alias: 'auto-close' }) autoClose!: 'default' | 'inside' | 'outside' | 'manual';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Host() @Self() @Optional() public sidebarItem: SidebarItemComponent,
    @Host() @Self() @Optional() public buttonToolbar: ButtonToolbarComponent,
  ) { }

  ngDoCheck() {
    let element: HTMLElement;
    if (this.sidebarItem) {
      element = this.sidebarItem.element;
    } else if (this.buttonToolbar) {
      element = this.elementRef.nativeElement;
    } else {
      element = this.elementRef.nativeElement;
    }
    if (this.toggle)
      this.renderer.setAttribute(element, 'data-bs-toggle', this.toggle);
    if (this.autoClose === 'default') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'true',
      );
    }
    if (this.autoClose === 'inside') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'inside',
      );
    }
    if (this.autoClose === 'outside') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'outside',
      );
    }
    if (this.autoClose === 'manual') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'false',
      );
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

    if (this.toggle === 'dropdown' && this.target === '#') {
      this.renderer.setAttribute(element, 'href', '#');
    } else if (element?.nodeName.toLowerCase() === 'a') {
      this.renderer.setAttribute(element, 'href', `#${this.target}`);
    } else {
      this.renderer.setAttribute(element, 'data-bs-target', `#${this.target}`);
    }
  }
}
