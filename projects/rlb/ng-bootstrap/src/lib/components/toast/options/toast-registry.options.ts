import { Injectable, Type } from '@angular/core';
import { ToastRegistry } from './toast-registry';

@Injectable({
  providedIn: 'root',
})
export class ToastRegistryOptions implements ToastRegistry {
  public toasts!: Type<any>[];
}
