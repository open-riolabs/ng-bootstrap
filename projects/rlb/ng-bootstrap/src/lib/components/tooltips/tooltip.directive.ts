import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  AfterViewInit,
  booleanAttribute,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
    selector: '[tooltip]',
    standalone: false
})
export class TooltipDirective implements OnInit, OnChanges {
  static bsInit = false;
  private _tooltip: Tooltip | undefined;
  @Input({ alias: 'tooltip', required: true }) tooltip!: string | null | undefined;
  @Input({ alias: 'tooltip-placement' }) placement!: 'top' | 'bottom' | 'left' | 'right';
  @Input({ alias: 'tooltip-class' }) customClass!: string;
  @Input({ alias: 'tooltip-html', transform: booleanAttribute }) html?: boolean;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tooltip']) {
      if (this.tooltip) {
        this._tooltip?.enable();
        this._tooltip?.setContent({ '.tooltip-inner': this.tooltip || '' });
      } else {
        this._tooltip?.disable();
      }
    }
    if (changes['placement']) {
      if (this.placement) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', this.placement);
        this._tooltip?.update();
      }
    }
    if (changes['customClass']) {
      if (this.customClass) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-custom-class', this.customClass);
        this._tooltip?.update();
      }
    }
    if (changes['html']) {
      if (this.html) {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-html', 'true');
        this._tooltip?.update();
      }
    }
  }

  ngOnInit() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'tooltip',);
    if (this.placement) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-placement', this.placement);
    }
    if (this.customClass) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-custom-class', this.customClass);
    }
    if (this.tooltip) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-title', this.tooltip);
    }
    if (this.html) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-html', 'true');
    }
    this._tooltip = new Tooltip(this.elementRef.nativeElement);
  }
}
