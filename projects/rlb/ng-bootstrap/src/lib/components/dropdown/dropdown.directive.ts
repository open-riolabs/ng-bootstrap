import { Directive, DoCheck, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, } from '@angular/core';
import { Dropdown } from 'bootstrap';
import { VisibilityEventBase } from '../../shared/types';

@Directive({
    selector: 'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
    standalone: false
})
export class DropdownDirective implements DoCheck, OnInit {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }
  private _dropdown: Dropdown | undefined;
  @Input({ alias: 'offset' }) offset!: string;
  @Input({ alias: 'auto-close' }) autoClose: 'default' | 'inside' | 'outside' | 'manual' = 'default';
  @Output('status-changed') statusChanged = new EventEmitter<VisibilityEventBase>();

  ngOnInit(): void {
    
    switch (this.autoClose) {
      case 'default':
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'data-bs-auto-close',
          'true',
        );
        break;
      case 'inside':
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'data-bs-auto-close',
          'inside',
        );
        break;
      case 'outside':
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'data-bs-auto-close',
          'outside',
        );
        break;
      case 'manual':
        this.renderer.setAttribute(
          this.elementRef.nativeElement,
          'data-bs-auto-close',
          'false',
        );
        break;
    }
    
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
  }
}
