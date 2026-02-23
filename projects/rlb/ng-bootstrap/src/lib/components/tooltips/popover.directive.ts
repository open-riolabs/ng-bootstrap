import {
  AfterViewInit,
  Directive,
  ElementRef,
  Renderer2,
  effect,
  input,
} from '@angular/core';
import { Popover } from 'bootstrap';

@Directive({
  selector: '[popover]',
  standalone: false
})
export class PopoverDirective implements AfterViewInit {
  static bsInit = false;
  private _popover: Popover | undefined;

  popover = input<string | undefined>(undefined, { alias: 'popover' });
  placement = input<'top' | 'bottom' | 'left' | 'right'>('top', { alias: 'popover-placement' });
  customClass = input('', { alias: 'popover-class' });
  title = input('', { alias: 'popover-title' });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'popover');
    });

    effect(() => {
      const p = this.placement();
      if (p) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', p);
        this._popover?.update();
      }
    });

    effect(() => {
      const c = this.customClass();
      if (c) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-custom-class', c);
        this._popover?.update();
      }
    });

    effect(() => {
      const t = this.title();
      if (t) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-title', t);
        this._popover?.update();
      }
    });

    effect(() => {
      const content = this.popover();
      if (content) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-content', content);
        this._popover?.update();
      }
    });
  }

  ngAfterViewInit() {
    this._popover = new Popover(this.elementRef.nativeElement);
  }
}
