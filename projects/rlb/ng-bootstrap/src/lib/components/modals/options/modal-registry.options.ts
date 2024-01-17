import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalRegistryOptions {
  public modals!: Type<any>[];
}
