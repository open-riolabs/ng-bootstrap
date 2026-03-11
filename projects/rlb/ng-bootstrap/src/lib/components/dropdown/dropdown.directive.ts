import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  effect,
  input,
  output,
} from '@angular/core';
import { Dropdown } from 'bootstrap';
import { ComponentOptions } from "bootstrap/js/dist/base-component";
import { VisibilityEventBase } from '../../shared/types';

@Directive({
  selector: 'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
  standalone: false
})
export class DropdownDirective implements OnInit, OnDestroy {
  private _dropdown: Dropdown | undefined;
  private listeners: (() => void)[] = [];

  offset = input<number[]>([], { alias: 'offset' });
  autoClose = input<'default' | 'inside' | 'outside' | 'manual'>('default', { alias: 'auto-close' });
  statusChanged = output<VisibilityEventBase>({ alias: 'status-changed' });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    effect(() => {
      this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-toggle');
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-toggle', 'dropdown');

      if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'href', `#`);
      }
    });

    effect(() => {
      const scale = this.autoClose();
      let value = 'true';
      switch (scale) {
        case 'inside': value = 'inside'; break;
        case 'outside': value = 'outside'; break;
        case 'manual': value = 'false'; break;
      }
      this.renderer.setAttribute(this.elementRef.nativeElement, 'data-bs-auto-close', value);
    });
  }

  ngOnInit(): void {
    const dropdownOptions: ComponentOptions = {
      offset: this.offset(),
      display: this.offset().length ? 'dynamic' : 'static'
    };

    if (dropdownOptions["display"] === 'dynamic') {
      this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-dynamic');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-static');
    }

    this._dropdown = Dropdown.getOrCreateInstance(this.elementRef.nativeElement, dropdownOptions);

    const el = this.elementRef.nativeElement;
    this.listeners.push(
      this.renderer.listen(el, 'show.bs.dropdown', () => this.statusChanged.emit('show')),
      this.renderer.listen(el, 'shown.bs.dropdown', () => this.statusChanged.emit('shown')),
      this.renderer.listen(el, 'hide.bs.dropdown', () => this.statusChanged.emit('hide')),
      this.renderer.listen(el, 'hidden.bs.dropdown', () => this.statusChanged.emit('hidden')),
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    this._dropdown?.dispose();
  }
}
