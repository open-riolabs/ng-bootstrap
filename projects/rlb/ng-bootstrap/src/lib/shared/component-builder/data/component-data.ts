import { InputSignal, ModelSignal } from '@angular/core';

export interface ComponentData<T = any> {
  data: T | InputSignal<T> | ModelSignal<T>;
}
