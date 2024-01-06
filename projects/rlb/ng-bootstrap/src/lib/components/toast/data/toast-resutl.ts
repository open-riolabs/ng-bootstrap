import { ToastCloseReason } from '../../../shared/types';

export interface ToastResult<T = void> {
  reason: ToastCloseReason;
  result: T | null;
}
