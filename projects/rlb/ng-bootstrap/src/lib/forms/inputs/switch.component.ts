import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { AbstractComponent } from './abstract-field.component';

@Component({
  selector: 'rlb-switch',
  template: `
    <div class="d-flex align-items-center gap-2">
      @if (errors() && showError() && (control?.touched || control?.dirty)) {
        <div class="invalid-feedback d-block">
          {{ errors() | json }}
        </div>
      }
      <ng-content select="[before]"></ng-content>

      <div class="form-check form-switch m-0">
        <input
          #field
          class="form-check-input"
          type="checkbox"
          [id]="id()"
          [attr.disabled]="isDisabled() ? true : undefined"
          [attr.readonly]="readonly() ? true : undefined"
          (blur)="touch()"
          [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
          (input)="update($event.target)"
        />
      </div>

      <ng-content select="[after]"></ng-content>
    </div>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent extends AbstractComponent<boolean> implements AfterViewInit {
  disabled = input(false, {
    transform: booleanAttribute,
  });
  readonly = input(false, { transform: booleanAttribute });
  size = input<'small' | 'large' | undefined>(undefined);
  userDefinedId = input('', { alias: 'id' });

  el = viewChild.required<ElementRef<HTMLInputElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  constructor() {
    super();
  }

  update(ev: EventTarget | null) {
    if (!this.isDisabled()) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.checked);
    }
  }

  override onWrite(data: boolean | undefined): void {
    if (data !== undefined) this.value.set(data);
    this.updateInternalValue();
  }

  ngAfterViewInit() {
    this.updateInternalValue();
  }

  private updateInternalValue(): void {
    const el = this.el();
    const data = this.value();
    if (el && el.nativeElement) {
      if (data === undefined || data === null) return;
      if (typeof data === 'string') {
        el.nativeElement.checked = /^true$/i.test(data);
      } else {
        el.nativeElement.checked = data;
      }
    }
  }
}
