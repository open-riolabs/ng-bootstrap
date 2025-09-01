import {
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Dropdown } from 'bootstrap';
import { VisibilityEventBase } from '../../shared/types';
import { ComponentOptions } from "bootstrap/js/dist/base-component";

@Directive({
    selector: 'a[rlb-dropdown], button[rlb-dropdown], span[rlb-badge][rlb-dropdown]',
    standalone: false
})
export class DropdownDirective implements DoCheck, OnInit, OnDestroy {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) { }
  private _dropdown: Dropdown | undefined;
  private listeners: (() => void)[] = [];
  @Input({ alias: 'offset' }) offset: number[] = [];
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
    
    const dropdownOptions: ComponentOptions = {
      offset: this.offset,
      // bootstrap offset functionality is offered by popper.js library
      // it requires "display: dynamic" (default bootstrap value = static)
      display: this.offset.length ? 'dynamic' : 'static'
    }
    
    // add a custom class to customize css behavior
    if (dropdownOptions["display"] === 'dynamic') {
      this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-dynamic');
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, 'dropdown-static');
    }
    
    this._dropdown = Dropdown.getOrCreateInstance(this.elementRef.nativeElement, dropdownOptions);
    // this.elementRef.nativeElement.addEventListener('show.bs.dropdown', () => {
    //   this.statusChanged.emit('show');
    // })
    // this.elementRef.nativeElement.addEventListener('shown.bs.dropdown', () => {
    //   this.statusChanged.emit('shown');
    // })
    // this.elementRef.nativeElement.addEventListener('hide.bs.dropdown', () => {
    //   this.statusChanged.emit('hide');
    // })
    // this.elementRef.nativeElement.addEventListener('hidden.bs.dropdown', () => {
    //   this.statusChanged.emit('hidden');
    // })
    
    // event handlers via Renderer2.listen (returns unsubscribe fn)
    const el = this.elementRef.nativeElement;
    this.listeners.push(
      this.renderer.listen(el, 'show.bs.dropdown', () => this.statusChanged.emit('show')),
      this.renderer.listen(el, 'shown.bs.dropdown', () => this.statusChanged.emit('shown')),
      this.renderer.listen(el, 'hide.bs.dropdown', () => this.statusChanged.emit('hide')),
      this.renderer.listen(el, 'hidden.bs.dropdown', () => this.statusChanged.emit('hidden')),
    );
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
  }
  
  ngOnDestroy() {
    // clean up event listeners
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
    
    // bootstrap cleanup
    this._dropdown?.dispose();
  }
}
