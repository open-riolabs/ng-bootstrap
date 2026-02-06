import {
  Injectable,
  InputSignal,
  ModelSignal,
  Optional,
  Self
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors, } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';

@Injectable()
export abstract class AbstractComponent<T = any>
  implements ControlValueAccessor {
  public abstract disabled?: boolean | InputSignal<boolean | undefined> | ModelSignal<boolean>;
  protected abstract userDefinedId: string | InputSignal<string> | ModelSignal<string>;
  protected onTouched: Function = () => { };
  protected onChanged: Function = (v: T) => {
  };
  public value!: T;
  private _id!: string;
  public get id(): string {
    const userDefinedIdValue = typeof this.userDefinedId === 'function'
      ? (this.userDefinedId as any)()
      : this.userDefinedId;
    return (userDefinedIdValue as string) || this._id;
  }
  constructor(
    idService: UniqueIdService,
    @Self() @Optional() public control?: NgControl,
  ) {
    this._id = idService.id;
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  protected setValue(val: T) {
    this.value = val;
    this.onChanged?.(val);
  }

  touch() {
    this.onTouched();
  }

  writeValue(val: T): void {
    this.value = val;
    this.onWrite(val);
  }

  registerOnChange(fn: (v: T) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (typeof this.disabled === 'function' && (this.disabled as any).set) {
      (this.disabled as any).set(isDisabled);
    } else {
      (this.disabled as any) = isDisabled;
    }
  }

  get invalid(): boolean {
    return this.control?.invalid || false;
  }

  get showError(): boolean {
    if (!this.control) return false;
    const { dirty, touched } = this.control;
    return this.invalid ? dirty || touched || false : false;
  }

  get errors(): ValidationErrors {
    return this.control?.errors || {};
  }

  onWrite(data: T) { };
}
