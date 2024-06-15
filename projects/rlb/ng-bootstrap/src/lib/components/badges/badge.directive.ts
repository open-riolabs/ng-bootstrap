import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { Color } from '../../shared/types';

@Directive({
  selector: '[badge]',
})
export class BadgeDirective implements DoCheck {
  @Input({ alias: 'badge' }) badge?: string;
  @Input({ alias: 'badge-pill', transform: booleanAttribute }) pill!: boolean;
  @Input({ alias: 'badge-border', transform: booleanAttribute }) border!: boolean
  @Input({ alias: 'badge-top', transform: numberAttribute }) top!: number;
  @Input({ alias: 'badge-start', transform: numberAttribute }) start!: number;
  @Input({ alias: 'badge-color' }) color: Color = 'danger';
  @Input({ alias: 'hidden-text' }) hiddenText!: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngDoCheck() {
    const badge = this.renderer.createElement('span');

    if (this.top || this.start || this.top === 0 || this.start === 0) {
      this.renderer.addClass(badge, 'position-absolute');
      if (this.top || this.top === 0) {
        this.renderer.addClass(badge, `top-${this.top}`);
      }
      if (this.start || this.start === 0) {
        this.renderer.addClass(badge, `start-${this.start}`);
      }
      this.renderer.addClass(badge, 'translate-middle');
    }
    this.renderer.addClass(badge, 'badge');
    if (this.pill) {
      this.renderer.addClass(badge, 'rounded-pill');
    }
    if (this.border) {
      this.renderer.addClass(badge, 'rounded-border');
    }
    if (this.color) {
      this.renderer.addClass(badge, `bg-${this.color}`);
    }
    if (this.badge) {
      this.renderer.appendChild(badge, this.renderer.createText(this.badge));
    } else {
      if (this.top || this.start || this.top === 0 || this.start === 0) {
        this.renderer.addClass(badge, `p-2`);
      } else {
        this.renderer.addClass(badge, `ps-0`);
        this.renderer.addClass(badge, `ms-2`);
      }
      this.renderer.addClass(badge, `border`);
      this.renderer.addClass(badge, `border-light`);
      this.renderer.addClass(badge, `rounded-circle`);
      if (!this.hiddenText) {
        const text = this.renderer.createElement('span');
        this.renderer.addClass(text, 'visually-hidden');
        this.renderer.appendChild(badge, text);
      }
    }
    if (this.hiddenText) {
      const text = this.renderer.createElement('span');
      this.renderer.addClass(text, 'visually-hidden');
      this.renderer.appendChild(
        text,
        this.renderer.createText(this.hiddenText),
      );
      this.renderer.appendChild(badge, text);
    }
    this.renderer.appendChild(this.elementRef.nativeElement, badge);
  }
}
