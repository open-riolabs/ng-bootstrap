import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnDestroy,
  DoCheck,
  AfterViewInit,
} from '@angular/core';
import { Toast } from 'bootstrap';
import { InnerToastService } from './inner-toast.service';
import { ToastCloseReason } from '../../shared/types';
import { IToast } from './data/toast';
import { ToastOptions } from './data/toast-options';

@Directive({
  selector: '[rlb-toast]',
  standalone: true,
})
export class ToastDirective implements OnDestroy, AfterViewInit {
  @Input({ alias: 'id' }) id!: string;
  @Input({ alias: 'data-instance' }) instance!: IToast;
  @Input({ alias: 'data-options' }) options!: ToastOptions;

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
    this.renderer.setAttribute(this.contentElement, 'id', `${this.id}`);
    this.renderer.setAttribute(this.contentElement, 'role', 'alert');
    this.renderer.setAttribute(this.contentElement, 'aria-live', 'assertive');
    this.renderer.setAttribute(this.contentElement, 'aria-atomic', 'true');
    if (this.options?.color) {
      this.renderer.addClass(
        this.contentElement,
        `text-bg-${this.options.color}`,
      );
    }
    if (this.options?.classes) {
      for (const c of this.options.classes) {
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
      animation: this.options?.animation || true,
      autohide: this.options?.autohide || true,
      delay: this.options?.delay || 5000,
    });
    this.bsToast.show();
  }

  ngOnDestroy(): void {
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
    // this._reasonButtons?.forEach((btn) => {
    //   btn.removeEventListener('click', null);
    // });
    this.bsToast?.dispose();
  }

  private _openChange_f = (e: Event) => {
    this.innerToastService.eventToast(
      e.type.replace('.bs.toast', ''),
      this._toastReason,
      this.id,
      this.instance?.result,
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
            if (this.instance.valid) {
              this.bsToast?.hide();
            }
          }
        });
      });
    }
  }
}
