import { Signal } from '@angular/core';

export interface ComponentData<T = any> {
  data: Signal<T>;
}
