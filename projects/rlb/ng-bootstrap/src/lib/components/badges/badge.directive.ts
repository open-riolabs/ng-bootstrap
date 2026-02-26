import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  input,
  numberAttribute,
  Renderer2,
} from '@angular/core';
import { Color } from '../../shared/types';

@Directive({
  selector: '[badge]',
  standalone: false,
})
export class BadgeDirective implements AfterViewInit {
  badge = input<string | number | undefined>(undefined, { alias: 'badge' });
  pill = input(false, { alias: 'badge-pill', transform: booleanAttribute });
  border = input(false, { alias: 'badge-border', transform: booleanAttribute });
  top = input<number | undefined, unknown>(undefined, {
    alias: 'badge-top',
    transform: numberAttribute,
  });
  start = input<number | undefined, unknown>(undefined, {
    alias: 'badge-start',
    transform: numberAttribute,
  });
  color = input<Color>('danger', { alias: 'badge-color' });
  textColor = input<string>('light', {
    alias: 'badge-text-color',
  });
  hiddenText = input<string | undefined>(undefined, { alias: 'hidden-text' });
  dot = input(false, { alias: 'badge-dot', transform: booleanAttribute });

  private badgeContent!: any;
  private badgeElement!: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      this.updateBadge();
    });
  }

  ngAfterViewInit() {
    this.createBadgeElement();
  }

  private updateBadge() {
    if (!this.badgeElement) return;
    const badgeValue = this.castToString(this.badge());
    if (badgeValue) {
      if (this.badgeContent) {
        this.badgeContent.data = badgeValue;
        this.badgeElement.style.display = 'inline';
      } else {
        this.badgeContent = this.renderer.createText(badgeValue);
        this.renderer.appendChild(this.badgeElement, this.badgeContent);
        this.badgeElement.style.display = 'inline';
      }
    } else {
      this.badgeElement.style.display = 'none';
    }
  }

  private createBadgeElement() {
    this.badgeElement = this.renderer.createElement('span');

    const top = this.top();
    const start = this.start();
    const color = this.color();
    const pill = this.pill();
    const border = this.border();
    const hiddenText = this.hiddenText();
    const badgeValue = this.castToString(this.badge());
    const textColor = this.textColor();

    if (top || start || top === 0 || start === 0) {
      this.renderer.addClass(this.badgeElement, 'position-absolute');
      if (top || top === 0) {
        this.renderer.addClass(this.badgeElement, `top-${top}`);
      }
      if (start || start === 0) {
        this.renderer.addClass(this.badgeElement, `start-${start}`);
      }
      this.renderer.addClass(this.badgeElement, 'translate-middle');
    }
    this.renderer.addClass(this.badgeElement, 'badge');
    if (pill) {
      this.renderer.addClass(this.badgeElement, 'rounded-pill');
    }
    if (border) {
      this.renderer.addClass(this.badgeElement, 'rounded-border');
    }
    if (color) {
      this.renderer.addClass(this.badgeElement, `bg-${color}`);
    }
    if (textColor) {
      this.renderer.addClass(this.badgeElement, `text-${textColor}`);
    }
    if (badgeValue) {
      this.badgeContent = this.renderer.createText(badgeValue);
      this.renderer.appendChild(this.badgeElement, this.badgeContent);
    } else if (this.dot()) {
      if (top || start || top === 0 || start === 0) {
        this.renderer.addClass(this.badgeElement, `p-2`);
      } else {
        this.renderer.addClass(this.badgeElement, `ps-0`);
        this.renderer.addClass(this.badgeElement, `ms-2`);
      }
      this.renderer.addClass(this.badgeElement, `border`);
      this.renderer.addClass(this.badgeElement, `border-light`);
      this.renderer.addClass(this.badgeElement, `rounded-circle`);
      if (!hiddenText) {
        const text = this.renderer.createElement('span');
        this.renderer.addClass(text, 'visually-hidden');
        this.renderer.appendChild(this.badgeElement, text);
      }
    } else {
      this.badgeElement.style.display = 'none';
    }
    if (hiddenText) {
      const text = this.renderer.createElement('span');
      this.renderer.addClass(text, 'visually-hidden');
      this.renderer.appendChild(text, this.renderer.createText(hiddenText));
      this.renderer.appendChild(this.badgeElement, text);
    }
    this.renderer.appendChild(this.elementRef.nativeElement, this.badgeElement);
  }

  private castToString(value: string | number | undefined): string {
    if (value && typeof value === 'number') {
      return value.toString();
    } else {
      return value as string;
    }
  }
}
