import { Injectable, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors, } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';

@Injectable()
export abstract class AbstractComponent<T = any>
  implements ControlValueAccessor {
  public abstract disabled?: boolean;
  protected abstract userDefinedId: string;
  protected onTouched: Function = () => { };
  protected onChanged: Function = (s: string) => { };
  public value!: T;
  private _id!: string;
  public get id(): string {
    return this.userDefinedId || this._id;
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

  registerOnChange(fn: (v: string) => void): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
