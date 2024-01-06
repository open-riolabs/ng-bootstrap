import { ModalType } from '../../../shared/types';

export interface ToastData<T = any> {
  title: string;
  type?: ModalType;
  content: T | undefined;
  ok?: string;
}
