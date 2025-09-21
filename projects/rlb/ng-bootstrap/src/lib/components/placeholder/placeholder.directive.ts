import { Directive, DoCheck, ElementRef, Input, Renderer2, } from '@angular/core';
import { Color } from '../../shared/types';

// TODO do we need this directive?
// component has more potential and flexibility
@Directive({
    selector: '[rlb-placeholder]',
    standalone: false
})
export class PlaceholderDirective implements DoCheck {
  @Input({ alias: 'placeholder-color' }) color?: Color;
  @Input({ alias: 'placeholder-size' }) size?: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input({ alias: 'placeholder-animation' }) animation?: 'glow' | 'fade' | 'none' = 'none';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngDoCheck() {
    this.renderer.addClass(this.elementRef.nativeElement, 'placeholder');
    if (this.color) {
      this.renderer.addClass(this.elementRef.nativeElement, `bg-${this.color}`);
    }
    if (this.size && this.size !== 'md') {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        `placeholder-${this.size}`,
      );
    }
    if (this.animation && this.animation !== 'none') {
      this.renderer.addClass(
        this.elementRef.nativeElement,
        `placeholder-${this.animation}`,
      );
    }
  }
}
