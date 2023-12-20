import { Component, AfterViewInit, ElementRef, Renderer2 } from "@angular/core";

@Component({
  selector: 'span[rlb-navbar-separator]',
  template: `<ng-content></ng-content>`,
})
export class NavbarSeparatorComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const cont = this.elementRef.nativeElement.parentNode;
    const li = this.renderer.createElement('li');
    this.renderer.addClass(li, 'nav-item');
    this.renderer.addClass(li, 'separator');
    this.renderer.appendChild(li, this.elementRef.nativeElement);
    this.renderer.appendChild(cont, li);
  }
}