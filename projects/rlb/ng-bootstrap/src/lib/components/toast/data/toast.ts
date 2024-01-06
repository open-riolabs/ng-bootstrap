import { ComponentData } from '../../../shared/component-builder';
import { ToastData } from './toast-data';

export interface IToast<Input = any, Output = any>
  extends ComponentData<ToastData<Input>> {
  valid?: boolean;
  result?: Output;
}
