import { Color } from '@rlb/ng-bootstrap';

export interface Progress {
  max: number;
  min: number;
  value: number;
  height: number;
  animated: boolean;
  striped: boolean;
  ariaLabel: string;
  showValue: boolean;
  color: Color;
  textColor: Color;
  text?: string;
}
