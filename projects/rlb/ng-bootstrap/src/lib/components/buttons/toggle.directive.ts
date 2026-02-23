import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  Host,
  input,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import { ButtonToolbarComponent } from './boutton-toolbar.component';

@Directive({
  selector: `
    button[toggle],
    a[toggle],
    rlb-navbar-item[toggle],
    rlb-button-toolbar[toggle]`,
  standalone: false
})
export class ToggleDirective {
  toggle = input.required<'offcanvas' | 'collapse' | 'tab' | 'pill' | 'dropdown' | 'buttons-group'>({ alias: 'toggle' });
  target = input.required<string>({ alias: 'toggle-target' });
  collapsed = input(false, { transform: booleanAttribute });
  autoClose = input<'default' | 'inside' | 'outside' | 'manual'>('default', { alias: 'auto-close' });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Host() @Self() @Optional() public buttonToolbar: ButtonToolbarComponent,
  ) {
    effect(() => {
      const element = this.elementRef.nativeElement;
      const toggle = this.toggle();
      const target = this.target();
      const collapsed = this.collapsed();
      const autoClose = this.autoClose();

      this.renderer.setAttribute(element, 'data-bs-toggle', toggle);

      if (autoClose === 'default') {
        this.renderer.setAttribute(element, 'data-bs-auto-close', 'true');
      } else if (autoClose === 'inside') {
        this.renderer.setAttribute(element, 'data-bs-auto-close', 'inside');
      } else if (autoClose === 'outside') {
        this.renderer.setAttribute(element, 'data-bs-auto-close', 'outside');
      } else if (autoClose === 'manual') {
        this.renderer.setAttribute(element, 'data-bs-auto-close', 'false');
      }

      if (collapsed === true) {
        this.renderer.addClass(element, 'collapsed');
        this.renderer.setAttribute(element, 'aria-expanded', 'false');
      } else {
        this.renderer.removeClass(element, 'collapsed');
        this.renderer.setAttribute(element, 'aria-expanded', 'true');
      }

      this.renderer.setAttribute(element, 'aria-controls', target);

      if (toggle === 'dropdown' && target === '#') {
        this.renderer.setAttribute(element, 'href', '#');
      } else if (element?.nodeName.toLowerCase() === 'a') {
        this.renderer.setAttribute(element, 'href', `#${target}`);
      } else {
        this.renderer.setAttribute(element, 'data-bs-target', `#${target}`);
      }
    });
  }
}
