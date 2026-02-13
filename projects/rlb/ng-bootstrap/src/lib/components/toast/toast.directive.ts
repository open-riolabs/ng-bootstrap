import {
  AfterViewInit,
  Directive,
  ElementRef,
  input,
  isSignal,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Toast } from 'bootstrap';
import { ToastCloseReason } from '../../shared/types';
import { IToast } from './data/toast';
import { ToastOptions } from './data/toast-options';
import { InnerToastService } from './inner-toast.service';

@Directive({
  selector: '[rlb-toast]',
  standalone: true,
})
export class ToastDirective implements OnDestroy, AfterViewInit {
  id = input.required<string>({ alias: 'id' });
  instance = input.required<IToast>({ alias: 'data-instance' });
  options = input.required<ToastOptions>({ alias: 'data-options' });

  private bsToast!: Toast;
  private contentElement!: HTMLElement;
  private _reasonButtons!: NodeListOf<HTMLButtonElement> | null;
  private _toastReason!: ToastCloseReason;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private innerToastService: InnerToastService,
  ) { }

  ngAfterViewInit(): void {
    const cont = this.el.nativeElement.parentNode;
    this.contentElement = this.renderer.createElement('div');
    this.renderer.addClass(this.contentElement, 'toast');
    this.renderer.setAttribute(this.contentElement, 'id', `${this.id()}`);
    this.renderer.setAttribute(this.contentElement, 'role', 'alert');
    this.renderer.setAttribute(this.contentElement, 'aria-live', 'assertive');
    this.renderer.setAttribute(this.contentElement, 'aria-atomic', 'true');

    const opts = this.options();
    if (opts?.color) {
      this.renderer.addClass(
        this.contentElement,
        `text-bg-${opts.color}`,
      );
    }
    if (opts?.classes) {
      for (const c of opts.classes) {
        this.renderer.addClass(this.contentElement, c.trim());
      }
    }
    while (this.el.nativeElement.children.length > 0) {
      this.renderer.appendChild(
        this.contentElement,
        this.el.nativeElement.children[0],
      );
    }
    this.renderer.appendChild(cont, this.contentElement);
    this.el.nativeElement.remove();
    this.contentElement.addEventListener(`hide.bs.toast`, this._openChange_f);
    this.contentElement.addEventListener(`hidden.bs.toast`, this._openChange_f);
    this.contentElement.addEventListener(`show.bs.toast`, this._openChange_f);
    this.contentElement.addEventListener(`shown.bs.toast`, this._openChange_f);
    this.initButtons();
    this.bsToast = Toast.getOrCreateInstance(this.contentElement, {
      animation: opts?.animation || true,
      autohide: opts?.autohide || true,
      delay: opts?.delay || 5000,
    });
    this.bsToast.show();
  }

  ngOnDestroy(): void {
    if (this.contentElement) {
      this.contentElement.removeEventListener(
        `hide.bs.toast`,
        this._openChange_f,
      );
      this.contentElement.removeEventListener(
        `hidden.bs.toast`,
        this._openChange_f,
      );
      this.contentElement.removeEventListener(
        `show.bs.toast`,
        this._openChange_f,
      );
      this.contentElement.removeEventListener(
        `shown.bs.toast`,
        this._openChange_f,
      );
    }
    this.bsToast?.dispose();
  }

  private _openChange_f = (e: Event) => {
    this.innerToastService.eventToast(
      e.type.replace('.bs.toast', ''),
      this._toastReason,
      this.id(),
      this.instance()?.result,
    );
  };

  initButtons(): void {
    this._reasonButtons = this.contentElement.querySelectorAll(
      '[data-toast-reason]',
    );
    if (this._reasonButtons && this._reasonButtons.length > 0) {
      this._reasonButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this._toastReason = btn.getAttribute(
            'data-toast-reason',
          ) as ToastCloseReason;
          if (this._toastReason === 'cancel' || this._toastReason === 'close') {
            this.bsToast?.hide();
          }
          if (this._toastReason === 'ok') {
            const inst = this.instance();
            const isValid = isSignal(inst.valid) ? inst.valid() : inst.valid;
            if (isValid !== false) {
              this.bsToast?.hide();
            }
          }
        });
      });
    }
  }
}
