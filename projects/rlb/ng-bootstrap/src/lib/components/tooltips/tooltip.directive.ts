import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[tooltip]',
  standalone: false
})
export class TooltipDirective implements OnInit, OnDestroy {
  static bsInit = false;
  private _tooltip: Tooltip | undefined;

  tooltip = input<string | null | undefined>(undefined, { alias: 'tooltip' });
  placement = input<'top' | 'bottom' | 'left' | 'right'>('top', { alias: 'tooltip-placement' });
  customClass = input('', { alias: 'tooltip-class' });
  html = input(false, { alias: 'tooltip-html', transform: booleanAttribute });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      const title = this.tooltip();
      if (this._tooltip) {
        if (title) {
          this._tooltip.enable();
          this._tooltip.setContent({ '.tooltip-inner': title || '' });
        } else {
          this._tooltip.disable();
        }
      }
    });

    effect(() => {
      const p = this.placement();
      if (p) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', p);
        this._tooltip?.update();
      }
    });

    effect(() => {
      const c = this.customClass();
      if (c) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-custom-class', c);
        this._tooltip?.update();
      }
    });

    effect(() => {
      const h = this.html();
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-html', h ? 'true' : 'false');
      this._tooltip?.update();
    });
  }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'tooltip');

    // Initial content setup is handled by effect()
    this._tooltip = new Tooltip(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this._tooltip) {
      this._tooltip.dispose();
    }
  }
}
