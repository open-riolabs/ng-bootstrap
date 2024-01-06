import { Color } from '@rlb/ng-bootstrap';

export interface Badge {
  color?: Color;
  text: string;
  pill?: boolean;
  hiddenText?: string;
}
