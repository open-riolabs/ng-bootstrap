import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ElementRef,
  inject,
  signal,
  output,
} from '@angular/core';
import { InputComponent } from '../../../forms/inputs';
import { DataTableActionComponent } from '../../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-fab-input',
    template: `
    <div
      class="rlb-fab-input-wrapper"
      (focusout)="onFocusOut($event)"
    >
      <div
        class="fab-container"
        [class.d-none]="isOpen()"
        (click)="open()"
      >
        <ng-content select="rlb-fab"></ng-content>
      </div>

      <div
        class="input-container"
        [class.d-none]="!isOpen()"
        (keydown)="preventTyping($event)"
        (paste)="handlePaste($event)"
      >
        <ng-content select="rlb-input"></ng-content>
      </div>
    </div>
  `,
    styles: [
        `
      .rlb-fab-input-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .d-none {
        display: none !important;
      }
    `,
    ],
    host: {
        '(document:click)': 'onDocumentClick($event)',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DataTableActionComponent],
})
export class RlbFabInputComponent {
  isOpen = signal(false);

  rlbInput = contentChild(InputComponent, { descendants: true });

  pasteAccepted = output<string>();

  private el = inject(ElementRef);

  constructor() {}

  open() {
    this.isOpen.set(true);

    setTimeout(() => {
      const inputRef = this.rlbInput()?.el();
      if (inputRef && inputRef.nativeElement) {
        inputRef.nativeElement.focus();
      }
    }, 0);
  }

  close() {
    this.isOpen.set(false);

    // Clear the input on close to keep it pristine for the next interaction
    const inputRef = this.rlbInput()?.el();
    if (inputRef && inputRef.nativeElement) {
      inputRef.nativeElement.value = '';
    }
  }

  // Intercept standard typing
  preventTyping(event: KeyboardEvent) {
    const isShortcut = event.ctrlKey || event.metaKey;

    const allowedKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];

    if (!isShortcut && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Intercept the actual paste action
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();

    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData?.getData('text') || '';

    if (pastedText.trim()) {
      this.pasteAccepted.emit(pastedText.trim());
      this.close();
    }
  }

  onDocumentClick(event: MouseEvent) {
    if (!this.isOpen()) return;
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this.isOpen()) return;
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isFocusInside = this.el.nativeElement.contains(activeElement);

      if (!isFocusInside) {
        this.close();
      }
    }, 10);
  }
}
