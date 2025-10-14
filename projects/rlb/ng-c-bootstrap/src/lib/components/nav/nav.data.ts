import { Color } from '@rlb-core/lib-ng-bootstrap';

export interface Nav {
  horizontalAlignment?: 'center' | 'end';
  vertical?: boolean;
  view?: 'tab' | 'pills' | 'underline' | 'none';
  fill?: 'fill' | 'justified';
  items?: NavItem[];
}

export interface NavItem {
  text: string;
  link: string | any[] | null | undefined;
  icon?: string;
}

