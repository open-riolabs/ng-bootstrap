import { Injectable, EventEmitter, OnInit, OnDestroy, ElementRef, DoCheck, OnChanges, SimpleChanges, AfterContentChecked } from '@angular/core';
import { VisibilityEvent } from '../../shared/types';

abstract class _bs_component {
  abstract dispose(): void;
  abstract show(): void;
  abstract hide(): void;
  abstract toggle(): void;
  static getOrCreateInstance: (element: HTMLElement) => _bs_component;
}

@Injectable()
export abstract class ToggleAbstractComponent<T extends _bs_component>
  implements OnInit, OnDestroy, OnChanges, AfterContentChecked {
  protected _component!: T | undefined;
  protected htmlElement!: HTMLElement | Element | undefined;
  abstract get eventPrefix(): string;

  abstract getOrCreateInstance(element: HTMLElement | Element): T;
  abstract statusChange: EventEmitter<VisibilityEvent>;
  abstract status?: VisibilityEvent;

  constructor(private elementRef?: ElementRef<HTMLElement>) { }

  ngOnInit(elemnt?: HTMLElement | Element): void {
    this.htmlElement = elemnt || this.elementRef?.nativeElement;
    if (!this.htmlElement) throw new Error(`ElementRef not defined`);
    this.htmlElement.addEventListener(
      `hide.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.addEventListener(
      `hidden.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.addEventListener(
      `hidePrevented.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.addEventListener(
      `show.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.addEventListener(
      `shown.${this.eventPrefix}`,
      this._openChange_f,
    );
    this._component = this.getOrCreateInstance(this.htmlElement);
  }

  ngOnDestroy(elemnt?: HTMLElement | Element): void {
    this.htmlElement = elemnt || this.elementRef?.nativeElement;
    if (!this.htmlElement) throw new Error(`ElementRef not defined`);
    this.htmlElement.removeEventListener(
      `hide.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.removeEventListener(
      `hidden.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.removeEventListener(
      `hidePrevented.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.removeEventListener(
      `show.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.htmlElement.removeEventListener(
      `shown.${this.eventPrefix}`,
      this._openChange_f,
    );
    this._component?.dispose();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'] && changes['status'].currentValue) {
      switch (changes['status'].currentValue) {
        case `hidden`:
          this.status = `hide`;
          this._component?.hide();
          break;
        case `shown`:
          this.status = `show`;
          this._component?.show();
          break;
      }
    }
  }

  ngAfterContentChecked(): void {
    if (this.status === `shown`) {
      this.status = `show`;
      this._component?.show();
    }
    if (this.status === `hidden`) {
      this.status = `hide`;
      this._component?.hide();
    }
  }

  open() {
    this._component?.show();
  }

  close() {
    this._component?.hide();
  }

  toggle() {
    this._component?.toggle();
  }

  private _openChange_f = (e: Event) => {
    switch (e.type) {
      case `hide.${this.eventPrefix}`:
        this.statusChange.emit(`hide`);
        break;
      case `hidden.${this.eventPrefix}`:
        this.statusChange.emit(`hidden`);
        break;
      case `hidePrevented.${this.eventPrefix}`:
        this.statusChange.emit(`hidePrevented`);
        break;
      case `show.${this.eventPrefix}`:
        this.statusChange.emit(`show`);
        break;
      case `shown.${this.eventPrefix}`:
        this.statusChange.emit(`shown`);
        break;
    }
  };
}
