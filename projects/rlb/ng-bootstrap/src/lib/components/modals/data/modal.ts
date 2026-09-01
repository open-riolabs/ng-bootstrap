import { Signal } from '@angular/core';
import { ComponentData } from '../../../shared/component-builder/data/component-data';
import { ModalData } from './modal-data';

export interface IModal<Input = any, Output = any>
  extends ComponentData<ModalData<Input>> {
  valid?: boolean | Signal<boolean>;
  result?: Output;
}
