import { Directive, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: '[rlb-navbar-brand]',
})
export class NavbarBrandDirective {

  constructor(elementRef: ElementRef, renderer: Renderer2) {
    renderer.addClass(elementRef.nativeElement, 'navbar-brand');
  }
}
