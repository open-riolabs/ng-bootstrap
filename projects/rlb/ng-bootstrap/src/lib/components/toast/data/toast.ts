import { Signal } from '@angular/core';
import { ComponentData } from '../../../shared/component-builder';
import { ToastData } from './toast-data';

export interface IToast<Input = any, Output = any>
  extends ComponentData<ToastData<Input>> {
  valid?: boolean | Signal<boolean>;
  result?: Output;
}
