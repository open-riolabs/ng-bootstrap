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
    @Host() @Self() @Optional() public hostCheckboxComponent : SidebarItemComponent,
    
    ) { }

  ngDoCheck() {
    let o = null;
    o = (this.hostCheckboxComponent?.element ) ;
    // o = (this.elementRef as ElementRef<HTMLAnchorElement>)?.nativeElement;
    // o = (this.elementRef as ElementRef<HTMLButtonElement>)?.nativeElement;
    // o = (this.elementRef as ElementRef<ButtonToolbarComponent>)?.nativeElement;

    console.log('ToggleDirective.ngDoCheck', o, this.toggle, this.target, this.collapsed);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', this.toggle);
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'href', `#${this.target}`);
    } else {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-target', `#${this.target}`);
    }
    if (this.collapsed) {
      this.renderer.addClass(this.elementRef.nativeElement, 'collapsed');
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'true');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'collapsed');
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
    }
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-controls', this.target);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
  }
}
