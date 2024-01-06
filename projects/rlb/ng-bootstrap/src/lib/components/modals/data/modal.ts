import { ComponentData } from '../../../shared/component-builder';
import { ModalData } from './modal-data';

export interface IModal<Input = any, Output = any>
  extends ComponentData<ModalData<Input>> {
  valid?: boolean;
  result?: Output;
}
