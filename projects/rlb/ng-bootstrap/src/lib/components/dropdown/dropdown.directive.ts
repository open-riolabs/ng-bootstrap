import { Directive, ElementRef, Renderer2, Input, DoCheck } from "@angular/core";

@Directive({
  selector: 'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
})
export class DropdownDirective implements DoCheck {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @Input() offset!: string;
  @Input() autoClose!: 'default' | 'inside' | 'outside' | 'manual';

  ngDoCheck() {
    this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-toggle');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-expanded', 'false');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'dropdown');
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'href', `#`);
    }
    if (this.offset) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-offset', this.offset);
    }
    if (this.autoClose === 'default') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-auto-close', 'true');
    }
    if (this.autoClose === 'inside') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-auto-close', 'inside');
    }
    if (this.autoClose === 'outside') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-auto-close', 'outside');
    }
    if (this.autoClose === 'manual') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-auto-close', 'false');
    }
  }
}
