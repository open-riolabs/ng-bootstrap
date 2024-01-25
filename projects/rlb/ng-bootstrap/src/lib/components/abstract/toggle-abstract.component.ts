import {
  Injectable,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ElementRef,
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
  implements OnInit, OnDestroy {
  private _status!: VisibilityEvent;
  protected _component!: T | undefined;
  abstract get eventPrefix(): string;

  abstract statusChange: EventEmitter<VisibilityEvent>;

  get status() {
    return this._status;
  }
  @Input() set status(v: VisibilityEvent) {
    if (v === `show` || v == `shown`) {
      this.open();
      this._status = `shown`;
    } else {
      this.close();
      this._status = `hidden`;
    }
  }

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  abstract getOrCreateInstance(element: HTMLElement): T;

  ngOnInit(): void {
    this.elementRef.nativeElement?.addEventListener(
      `hide.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.addEventListener(
      `hidden.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.addEventListener(
      `hidePrevented.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.addEventListener(
      `show.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.addEventListener(
      `shown.${this.eventPrefix}`,
      this._openChange_f,
    );
    this._component = this.getOrCreateInstance(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement?.removeEventListener(
      `hide.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.removeEventListener(
      `hidden.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.removeEventListener(
      `hidePrevented.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.removeEventListener(
      `show.${this.eventPrefix}`,
      this._openChange_f,
    );
    this.elementRef.nativeElement?.removeEventListener(
      `shown.${this.eventPrefix}`,
      this._openChange_f,
    );
    this._component?.dispose();
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
      case `hide.bs.offcanvas`:
        this.statusChange.emit(`hide`);
        break;
      case `hidden.bs.offcanvas`:
        this.statusChange.emit(`hidden`);
        break;
      case `hidePrevented.bs.offcanvas`:
        this.statusChange.emit(`hidePrevented`);
        break;
      case `show.bs.offcanvas`:
        this.statusChange.emit(`show`);
        break;
      case `shown.bs.offcanvas`:
        this.statusChange.emit(`shown`);
        break;
    }
  };
}
