import { Color } from '@rlb/ng-bootstrap';

export interface Spinner {
  style: 'grow' | 'border';
  color: Color;
  size: 'sm' | 'md' | 'lg';
}
