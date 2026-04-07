import {
  ChangeDetectorRef,
  computed,
  DestroyRef,
  inject,
  Injectable,
  ModelSignal,
  OnInit,
  Optional,
  Self,
  signal,
  Signal,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UniqueIdService } from '../../shared/unique-id.service';

@Injectable()
export abstract class AbstractComponent<T = any> implements ControlValueAccessor, OnInit {
  public abstract disabled?: boolean | Signal<boolean | undefined> | ModelSignal<boolean>;
  protected abstract userDefinedId: Signal<string | undefined> | ModelSignal<string | undefined>;
  public readonly id = computed(() => this.userDefinedId() || this._id);
  private _id: string;

  protected idService = inject(UniqueIdService);
  protected cdr = inject(ChangeDetectorRef);
  protected destroyRef = inject(DestroyRef);
  @Self() @Optional() public control: NgControl | null = inject(NgControl, {
    optional: true,
    self: true,
  });

  protected onTouched: Function = () => {};
  protected onChanged: Function = (v: T) => {};

  public value = signal<T | undefined>(undefined);

  // Zoneless specific: Internal signals to mirror NgControl state
  protected controlInvalid = signal(false);
  protected controlTouched = signal(false);
  protected controlDirty = signal(false);
  protected controlErrors = signal<any>(null);

  constructor() {
    this._id = this.idService.id;
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngOnInit() {
    // Listen to Angular 18+ Form Events or Status changes
    if (this.control && this.control.control) {
      const ctrl = this.control.control;

      // Sync initial state
      this.syncControlState(ctrl);

      // Listen to value/status changes
      ctrl.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.syncControlState(ctrl);
        this.cdr.markForCheck();
      });

      // events to track touched/dirty state changes
      if (ctrl.events) {
        ctrl.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.syncControlState(ctrl);
          this.cdr.markForCheck();
        });
      }
    }
  }

  private syncControlState(ctrl: AbstractControl) {
    this.controlInvalid.set(ctrl.invalid);
    this.controlTouched.set(ctrl.touched);
    this.controlDirty.set(ctrl.dirty);
    this.controlErrors.set(ctrl.errors);
  }

  protected setValue(val: T) {
    this.value.set(val);
    this.onChanged?.(val);
  }

  touch() {
    this.onTouched();
    // Force sync immediately on interaction
    if (this.control?.control) this.syncControlState(this.control.control);
  }

  writeValue(val: T): void {
    this.value.set(val);
    this.onWrite(val);
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  invalid = computed(() => this.controlInvalid());
  errors = computed(() => this.controlErrors() || {});

  showError = computed(() => {
    if (!this.control) return false;
    return this.controlInvalid() ? this.controlDirty() || this.controlTouched() : false;
  });

  onWrite(data: T | undefined) {}
}
