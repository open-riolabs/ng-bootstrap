import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { Dropdown } from 'bootstrap';

@Directive({
  selector:
    'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
})
export class DropdownDirective implements DoCheck, OnInit {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }
  private _dropdown: Dropdown | undefined;
  @Input({ alias: 'offset' }) offset!: string;
  @Input({ alias: 'auto-close' }) autoClose!: 'default' | 'inside' | 'outside' | 'manual';
  @Output('status-changed') statusChanged = new EventEmitter();

  ngOnInit(): void {
    this._dropdown = Dropdown.getOrCreateInstance(this.elementRef.nativeElement);
    this.elementRef.nativeElement.addEventListener('show.bs.dropdown', () => {
      this.statusChanged.emit('show');
    })
    this.elementRef.nativeElement.addEventListener('shown.bs.dropdown', () => {
      this.statusChanged.emit('shown');
    })
    this.elementRef.nativeElement.addEventListener('hide.bs.dropdown', () => {
      this.statusChanged.emit('hide');
    })
    this.elementRef.nativeElement.addEventListener('hidden.bs.dropdown', () => {
      this.statusChanged.emit('hidden');
    })
  }

  ngDoCheck() {
    this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-toggle');
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'aria-expanded',
      'false',
    );
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'data-bs-toggle',
      'dropdown',
    );
    if (this.elementRef.nativeElement.nodeName.toLowerCase() === 'a') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'href', `#`);
    }
    if (this.offset) {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-offset',
        this.offset,
      );
    }
    if (this.autoClose === 'default') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'true',
      );
    }
    if (this.autoClose === 'inside') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'inside',
      );
    }
    if (this.autoClose === 'outside') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'outside',
      );
    }
    if (this.autoClose === 'manual') {
      this.renderer.setAttribute(
        this.elementRef.nativeElement,
        'data-bs-auto-close',
        'false',
      );
    }
  }
}
