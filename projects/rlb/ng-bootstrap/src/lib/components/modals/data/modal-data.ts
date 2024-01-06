import { ModalType } from '../../../shared/types';

export interface ModalData<T = any> {
  title: string;
  type?: ModalType;
  content: T | undefined;
  ok?: string;
}
