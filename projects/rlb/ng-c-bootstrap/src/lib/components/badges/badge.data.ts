import { Color } from '@lbdsh/lib-ng-bootstrap';

export interface Badge {
  color?: Color;
  text: string;
  pill?: boolean;
  hiddenText?: string;
}

