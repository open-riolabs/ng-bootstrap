import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '../buttons/buttons.component';
import { Color } from '../../shared/types';

/**
 * The little box a popconfirm opens. Built by {@link PopconfirmDirective}, never used directly.
 */
@Component({
  selector: 'rlb-popconfirm-panel',
  template: `
    <div
      class="card shadow"
      style="max-width: 20rem; min-width: 14rem"
      role="dialog"
      aria-modal="false"
      [attr.aria-label]="title() || message()"
    >
      <div class="card-body p-3">
        @if (title()) {
          <div class="fw-semibold mb-1">{{ title() }}</div>
        }
        <div class="text-body-secondary small">{{ message() }}</div>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button
            #cancel
            type="button"
            rlb-button
            color="secondary"
            size="sm"
            outline
            (click)="cancelled.emit()"
          >
            {{ cancelLabel() }}
          </button>
          <button
            type="button"
            rlb-button
            [color]="color()"
            size="sm"
            (click)="confirmed.emit()"
          >
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class PopconfirmPanelComponent {
  title = input<string | undefined>(undefined);
  message = input('');
  confirmLabel = input('Yes');
  cancelLabel = input('No');
  color = input<Color>('danger');

  confirmed = output<void>();
  cancelled = output<void>();

  // `rlb-button` is a component, so without `read` this would hand back the ButtonComponent
  // instance rather than the element, and focusing it would throw.
  private cancelButton = viewChild('cancel', { read: ElementRef<HTMLButtonElement> });

  /**
   * Focus lands on «No».
   *
   * The whole point of a popconfirm is to be a speed bump in front of something that cannot be
   * undone, and a confirm button under the cursor with focus on it is not a speed bump — one
   * stray Return and the row is gone.
   */
  focusInitial() {
    this.cancelButton()?.nativeElement.focus();
  }
}
