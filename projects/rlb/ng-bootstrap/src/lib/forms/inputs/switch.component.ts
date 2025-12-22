import {
  Component,
  ElementRef,
  Input,
  Optional,
  Self,
  ViewChild,
  booleanAttribute, AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
    selector: 'rlb-switch',
    template: `
      <div class="d-flex align-items-center gap-2">
        <ng-content select="[before]"></ng-content>

        <div class="form-check form-switch m-0">
          <input
            #field
            class="form-check-input"
            type="checkbox"
            [id]="id"
            [attr.disabled]="disabled ? true : undefined"
            [attr.readonly]="readonly ? true : undefined"
            (blur)="touch()"
            [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
            (input)="update($event.target)"
          />
        </div>

        <ng-content select="[after]"></ng-content>
      </div>
    `,
    standalone: false
})
export class SwitchComponent
  extends AbstractComponent<boolean>
  implements ControlValueAccessor, AfterViewInit {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly?: boolean;
  @Input({ alias: 'size' }) size?: 'small' | 'large';
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;

  private data!: boolean;

  constructor(
    idService: UniqueIdService,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.setValue(t?.checked);
    }
  }

  override onWrite(data: boolean): void {
    this.data = data
  }

  ngAfterViewInit() {
    if (this.el && this.el.nativeElement) {
      if (this.data === undefined || this.data === null) return;
      if (typeof this.data === 'string') {
        this.el.nativeElement.checked = /^true$/i.test(this.data);
      }
      else {
        this.el.nativeElement.checked = this.data;
      }
    }
  }
}
