import {
  AfterContentChecked,
  ElementRef,
  Injectable,
  OnDestroy,
  OnInit,
  OutputEmitterRef
} from '@angular/core';
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
  implements OnInit, OnDestroy, AfterContentChecked {
  protected _component!: T | undefined;
  protected htmlElement!: HTMLElement | Element | undefined;
  abstract get eventPrefix(): string;

  abstract getOrCreateInstance(element: HTMLElement | Element): T;
  abstract statusChange: OutputEmitterRef<VisibilityEvent>;
  abstract status?: VisibilityEvent;

  constructor(protected elementRef?: ElementRef<HTMLElement>) {
  }

  ngOnInit(elemnt?: HTMLElement | Element): void {
    this.htmlElement = elemnt || this.elementRef?.nativeElement;
    if (!this.htmlElement) throw new Error(`ElementRef not defined`);
    this._addEventListeners();
    this._component = this.getOrCreateInstance(this.htmlElement);
  }

  ngOnDestroy(elemnt?: HTMLElement | Element): void {
    this.htmlElement = elemnt || this.elementRef?.nativeElement;
    if (!this.htmlElement) throw new Error(`ElementRef not defined`);
    this._removeEventListeners();
    this._component?.dispose();
  }

  // We handle status changes via inputs/effects in children or by manual calls
  // The original ngOnChanges was used to react to status input changes.
  // Children will now use model() or effects to achieve this.

  ngAfterContentChecked(): void {
    if (this.status === 'show') {
      this.ensureInstance();
      this._component?.show();
    } else if (this.status === 'hide') {
      this.ensureInstance();
      this._component?.hide();
    }
  }

  open() {
    this.ensureInstance();
    this._component?.show();
  }

  close() {
    this.ensureInstance();
    this._component?.hide();
  }

  toggle() {
    this.ensureInstance();
    this._component?.toggle();
  }

  protected ensureInstance(): void {
    if (!this._component && this.htmlElement) {
      this._component = this.getOrCreateInstance(this.htmlElement);
    }
  }

  private _addEventListeners(): void {
    this.htmlElement?.addEventListener(`hide.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.addEventListener(`hidden.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.addEventListener(`hidePrevented.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.addEventListener(`show.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.addEventListener(`shown.${this.eventPrefix}`, this._openChange_f);
  }

  private _removeEventListeners(): void {
    this.htmlElement?.removeEventListener(`hide.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.removeEventListener(`hidden.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.removeEventListener(`hidePrevented.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.removeEventListener(`show.${this.eventPrefix}`, this._openChange_f);
    this.htmlElement?.removeEventListener(`shown.${this.eventPrefix}`, this._openChange_f);
  }

  protected _openChange_f = (e: Event) => {
    if (e.target !== this.htmlElement) return;

    switch (e.type) {
      case `hide.${this.eventPrefix}`:
        this.status = `hide`;
        this.statusChange.emit(`hide`);
        break;
      case `hidden.${this.eventPrefix}`:
        this.status = 'hidden';
        this.statusChange.emit(`hidden`);
        break;
      case `hidePrevented.${this.eventPrefix}`:
        this.status = 'hidePrevented';
        this.statusChange.emit(`hidePrevented`);
        break;
      case `show.${this.eventPrefix}`:
        this.status = 'show';
        this.statusChange.emit(`show`);
        break;
      case `shown.${this.eventPrefix}`:
        this.status = 'shown';
        this.statusChange.emit(`shown`);
        break;
    }
  };
}
