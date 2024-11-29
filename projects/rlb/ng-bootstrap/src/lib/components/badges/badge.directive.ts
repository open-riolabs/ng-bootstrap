import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  booleanAttribute,
  numberAttribute,
  AfterViewChecked,
  AfterViewInit,
} from '@angular/core';
import { Color } from '../../shared/types';

@Directive({
    selector: '[badge]',
    standalone: false
})
export class BadgeDirective implements AfterViewInit, DoCheck {
  @Input({ alias: 'badge' }) badge?: string;
  @Input({ alias: 'badge-pill', transform: booleanAttribute }) pill!: boolean;
  @Input({ alias: 'badge-border', transform: booleanAttribute }) border!: boolean;
  @Input({ alias: 'badge-top', transform: numberAttribute }) top!: number;
  @Input({ alias: 'badge-start', transform: numberAttribute }) start!: number;
  @Input({ alias: 'badge-color' }) color: Color = 'danger';
  @Input({ alias: 'hidden-text' }) hiddenText!: string;

  private badgeContent!: any;
  private badgeElement!: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  ngDoCheck(): void {
    if (this.badge) {
      if (this.badgeContent) {
        this.badgeContent.data = this.badge;
        this.badgeElement.style.display = 'inline';
      }
    } else {
      if (this.badgeContent) {
        this.badgeElement.style.display = 'none';
      }
    }
  }

  ngAfterViewInit() {
    this.badgeElement = this.renderer.createElement('span');

    if (this.top || this.start || this.top === 0 || this.start === 0) {
      this.renderer.addClass(this.badgeElement, 'position-absolute');
      if (this.top || this.top === 0) {
        this.renderer.addClass(this.badgeElement, `top-${this.top}`);
      }
      if (this.start || this.start === 0) {
        this.renderer.addClass(this.badgeElement, `start-${this.start}`);
      }
      this.renderer.addClass(this.badgeElement, 'translate-middle');
    }
    this.renderer.addClass(this.badgeElement, 'badge');
    if (this.pill) {
      this.renderer.addClass(this.badgeElement, 'rounded-pill');
    }
    if (this.border) {
      this.renderer.addClass(this.badgeElement, 'rounded-border');
    }
    if (this.color) {
      this.renderer.addClass(this.badgeElement, `bg-${this.color}`);
    }
    if (this.badge) {
      this.badgeContent = this.renderer.createText(this.badge);
      this.renderer.appendChild(this.badgeElement, this.badgeContent);
    } else {
      if (this.top || this.start || this.top === 0 || this.start === 0) {
        this.renderer.addClass(this.badgeElement, `p-2`);
      } else {
        this.renderer.addClass(this.badgeElement, `ps-0`);
        this.renderer.addClass(this.badgeElement, `ms-2`);
      }
      this.renderer.addClass(this.badgeElement, `border`);
      this.renderer.addClass(this.badgeElement, `border-light`);
      this.renderer.addClass(this.badgeElement, `rounded-circle`);
      if (!this.hiddenText) {
        const text = this.renderer.createElement('span');
        this.renderer.addClass(text, 'visually-hidden');
        this.renderer.appendChild(this.badgeElement, text);
      }
    }
    if (this.hiddenText) {
      const text = this.renderer.createElement('span');
      this.renderer.addClass(text, 'visually-hidden');
      this.renderer.appendChild(
        text,
        this.renderer.createText(this.hiddenText),
      );
      this.renderer.appendChild(this.badgeElement, text);
    }
    this.renderer.appendChild(this.elementRef.nativeElement, this.badgeElement);
  }
}
