import { Color } from '../../../shared/types';

export interface ToastOptions {
  animation?: boolean;
  autohide?: boolean;
  delay?: number;
  color?: Color;
  classes?: string[];
}
