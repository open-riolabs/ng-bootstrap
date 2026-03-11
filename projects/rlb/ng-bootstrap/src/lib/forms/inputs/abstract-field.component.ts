import { computed, Injectable, ModelSignal, Optional, Self, signal, Signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';

@Injectable()
export abstract class AbstractComponent<T = any> implements ControlValueAccessor {
  public abstract disabled?: boolean | Signal<boolean | undefined> | ModelSignal<boolean>;
  protected abstract userDefinedId: string | Signal<string> | ModelSignal<string>;
  protected onTouched: Function = () => {};
  protected onChanged: Function = (v: T) => {};
  public value!: T;
  private _id!: string;
  public get id(): string {
    const userDefinedIdValue =
      typeof this.userDefinedId === 'function' ? (this.userDefinedId as any)() : this.userDefinedId;
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

  protected cvaDisabled = signal(false);

  setDisabledState?(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  invalid = computed(() => {
    return this.control?.invalid || false;
  });

  showError = computed(() => {
    if (!this.control) return false;
    const { dirty, touched } = this.control;
    return this.invalid() ? dirty || touched || false : false;
  });

  errors = computed(() => {
    return this.control?.errors || {};
  });

  onWrite(data: T) {}
}
