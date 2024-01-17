import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastRegistryOptions {
  public toasts!: Type<any>[];
}
