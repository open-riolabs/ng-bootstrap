import { Injectable, Type } from '@angular/core';
import { ModalRegistry } from './modal-registry';

@Injectable({
  providedIn: 'root',
})
export class ModalRegistryOptions implements ModalRegistry {
  public modals!: Type<any>[];
}
