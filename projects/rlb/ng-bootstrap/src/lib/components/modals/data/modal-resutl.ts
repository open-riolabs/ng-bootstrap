import { ModalCloseReason } from '../../../shared/types';

export interface ModalResult<T = void> {
  reason: ModalCloseReason;
  result: T;
}
