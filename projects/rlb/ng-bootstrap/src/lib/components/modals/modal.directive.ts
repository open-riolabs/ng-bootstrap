import { AfterViewInit, Directive, effect, ElementRef, input, isSignal, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Modal } from 'bootstrap';
import { BreakpointService } from '../../shared/breakpoint.service';
import { ModalCloseReason } from '../../shared/types';
import { IModal } from './data/modal';
import { ModalOptions } from './data/modal-options';
import { InnerModalService } from './inner-modal.service';

@Directive({
  selector: '[rlb-modal]',
  standalone: true,
})
export class ModalDirective implements OnDestroy, AfterViewInit, OnInit {
  private bsModal!: Modal;
  private modalElement!: HTMLElement;
  private dialogElement!: HTMLElement;
  private contentElement!: HTMLElement;
  private _reasonButtons!: NodeListOf<HTMLButtonElement> | null;
  private _modalReason!: ModalCloseReason;
  private triggerElement: HTMLElement | null = null;

  id = input.required<string>({ alias: 'id' });
  instance = input.required<IModal>({ alias: 'data-instance' });
  options = input<ModalOptions | undefined>(undefined, { alias: 'data-options' });


  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private innerModalService: InnerModalService,
    private breakpointService: BreakpointService,
  ) {
    effect(() => {
      const opts = this.options();
      if (this.modalElement && this.dialogElement) {
        // Toggle backdrop/keyboard/etc.
        // For simplicity, we mostly set these once, but we can reactive-ly update some classes
        if (opts?.scrollable) {
          this.renderer.addClass(this.dialogElement, 'modal-dialog-scrollable');
        } else {
          this.renderer.removeClass(this.dialogElement, 'modal-dialog-scrollable');
        }

        if (opts?.verticalcentered) {
          this.renderer.addClass(this.dialogElement, 'modal-dialog-centered');
        } else {
          this.renderer.removeClass(this.dialogElement, 'modal-dialog-centered');
        }
      }
    });
  }

  ngOnInit(): void {
    this.triggerElement = document.activeElement as HTMLElement;

    const inst = this.instance();
    // Check prop existence
    const instanceData = typeof inst.data === 'function' ? (inst.data as any)() : inst.data;

    const hasContent =
      instanceData &&
      Object.prototype.hasOwnProperty.call(instanceData, 'content') &&
      instanceData.content !== undefined;

    if (hasContent) {
      const content = instanceData.content;
      // If content is Object / Array we handle it as a deep copy
      if (content !== null && typeof content === 'object') {
        inst.result = structuredClone(content);
      } else {
        // otherwise assign as is
        inst.result = content;
      }
    } else if (inst) {
      // default fallback
      inst.result = {};
    }
  }

  ngAfterViewInit(): void {
    const cont = this.el.nativeElement.parentNode;
    this.modalElement = this.renderer.createElement('div');
    this.dialogElement = this.renderer.createElement('div');
    this.contentElement = this.el.nativeElement;
    this.renderer.appendChild(cont, this.modalElement);
    this.renderer.appendChild(this.modalElement, this.dialogElement);
    this.renderer.appendChild(this.dialogElement, this.contentElement);
    this.renderer.addClass(this.modalElement, 'modal');
    this.renderer.addClass(this.modalElement, 'fade');
    this.renderer.setAttribute(this.modalElement, 'id', `${this.id()}`);
    this.renderer.setAttribute(this.modalElement, 'tabindex', '-1');
    this.renderer.addClass(this.dialogElement, 'modal-dialog');
    this.renderer.addClass(this.contentElement, 'modal-content');

    const opts = this.options();
    if (opts?.backdrop) {
      this.renderer.setAttribute(
        this.modalElement,
        'data-bs-backdrop',
        `${opts.backdrop}`,
      );
    }
    if (opts?.keyboard) {
      this.renderer.setAttribute(
        this.modalElement,
        'data-bs-keyboard',
        `${opts.keyboard}`,
      );
    }
    if (opts?.animation === false) {
      this.renderer.removeClass(this.modalElement, 'fade');
    }
    if (opts?.scrollable) {
      this.renderer.addClass(this.dialogElement, 'modal-dialog-scrollable');
    }
    if (opts?.verticalcentered) {
      this.renderer.addClass(this.dialogElement, 'modal-dialog-centered');
    }
    if (opts?.size) {
      this.renderer.addClass(this.dialogElement, `modal-${opts.size}`);
    }

    const isFullscreenUndefined = opts?.fullscreen === undefined;
    if (isFullscreenUndefined && this.breakpointService.isMobile) {
      this.renderer.addClass(this.dialogElement, `modal-fullscreen`);
    }

    if (opts?.fullscreen === true) {
      this.renderer.addClass(this.dialogElement, `modal-fullscreen`);
    }
    if (
      typeof opts?.fullscreen === 'string' &&
      opts?.fullscreen
    ) {
      this.renderer.addClass(
        this.dialogElement,
        `modal-fullscreen-${opts.fullscreen}`,
      );
    }
    this.modalElement.addEventListener(`hide.bs.modal`, this._openChange_f);
    this.modalElement.addEventListener(`hidden.bs.modal`, this._openChange_f);
    this.modalElement.addEventListener(
      `hidePrevented.bs.modal`,
      this._openChange_f,
    );
    this.modalElement.addEventListener(`show.bs.modal`, this._openChange_f);
    this.modalElement.addEventListener(`shown.bs.modal`, this._openChange_f);
    this.initButtons();
    this.bsModal = Modal.getOrCreateInstance(this.modalElement, {
      backdrop: opts?.backdrop || true,
      keyboard: opts?.keyboard || true,
      focus: opts?.focus || true,
    });
    this.bsModal.show();
  }

  ngOnDestroy(): void {
    if (this.modalElement) {
      this.modalElement.removeEventListener(`hide.bs.modal`, this._openChange_f);
      this.modalElement.removeEventListener(
        `hidden.bs.modal`,
        this._openChange_f,
      );
      this.modalElement.removeEventListener(
        `hidePrevented.bs.modal`,
        this._openChange_f,
      );
      this.modalElement.removeEventListener(`show.bs.modal`, this._openChange_f);
      this.modalElement.removeEventListener(`shown.bs.modal`, this._openChange_f);
    }
    this.bsModal?.dispose();
    this.modalElement?.remove();
  }

  private _openChange_f = (e: Event) => {
    this.innerModalService.eventModal(
      e.type.replace('.bs.modal', ''),
      this._modalReason,
      this.id(),
      this.instance()?.result,
    );
  };

  show() {
    this.bsModal?.show();
  }
  hide(reason?: ModalCloseReason) {
    if (reason) {
      this._modalReason = reason;
    }
    this.bsModal?.hide();
    this.triggerElement?.focus();
  }

  initButtons(): void {
    this._reasonButtons = this.contentElement.querySelectorAll(
      '[data-modal-reason]',
    );
    if (this._reasonButtons && this._reasonButtons.length > 0) {
      this._reasonButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this._modalReason = btn.getAttribute(
            'data-modal-reason',
          ) as ModalCloseReason;
          if (this._modalReason === 'cancel' || this._modalReason === 'close') {
            this.bsModal?.hide();
            this.triggerElement?.focus();
          }
          if (this._modalReason === 'ok') {
            const inst = this.instance();
            const isValid = isSignal(inst.valid) ? inst.valid() : inst.valid;

            if (isValid !== false) { // Default to true if undefined
              this.bsModal?.hide();
              this.triggerElement?.focus();
            }
          }
        });
      });
    }
  }
}
