import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  AfterViewInit,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[tooltip]',
})
export class TooltipDirective implements DoCheck, AfterViewInit {
  static bsInit = false;

  @Input({ alias: 'tooltip', required: true }) tooltip!: string | undefined;
  @Input('tooltip-placement') placement!: 'top' | 'bottom' | 'left' | 'right';
  @Input('tooltip-class') customClass!: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngDoCheck() {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'data-bs-toggle',
      'tooltip',
    );
    if (this.placement) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-placement',
        this.placement,
      );
    }
    if (this.customClass) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-custom-class',
        this.customClass,
      );
    }
    if (this.tooltip) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-title',
        this.tooltip,
      );
    }
  }

  ngAfterViewInit() {
    new Tooltip(this.elementRef.nativeElement);
  }
}
