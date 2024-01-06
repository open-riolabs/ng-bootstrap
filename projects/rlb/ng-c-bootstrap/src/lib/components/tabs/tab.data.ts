import { Color, TextAlignment } from '@rlb/ng-bootstrap';

export interface Tab {
  horizontalAlignment?: 'center' | 'end';
  view?: 'tab' | 'pills' | 'underline' | 'none';
  vertical?: boolean;
  fill?: 'fill' | 'justified';
  class?: string;
  items?: TabPane[];
}

export interface TabPane {
  title: string;
  text: string;
  id: string;
}
