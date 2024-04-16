import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  AfterViewInit,
} from '@angular/core';
import { Popover } from 'bootstrap';

@Directive({
  selector: '[popover]',
})
export class PopoverDirective implements DoCheck, AfterViewInit {
  static bsInit = false;

  @Input({ alias: 'popover', required: true }) popover!: string | undefined;
  @Input({ alias: 'popover-placement' }) placement!: 'top' | 'bottom' | 'left' | 'right';
  @Input({ alias: 'popover-class' }) customClass!: string;
  @Input({ alias: 'popover-title' }) title!: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngDoCheck() {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'data-bs-toggle',
      'popover',
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
    if (this.title) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-title',
        this.title,
      );
    }
    if (this.popover) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-content',
        this.popover,
      );
    }
  }

  ngAfterViewInit() {
    new Popover(this.elementRef.nativeElement);
  }
}
