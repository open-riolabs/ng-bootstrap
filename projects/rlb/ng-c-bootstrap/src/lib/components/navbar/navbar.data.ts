import { Color } from '@rlb/ng-bootstrap';

export interface Navbar {
  dark?: boolean;
  color?: Color;
  placement?: 'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom';
  expand?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always';
  brand?: NavbarBrand;
  items?: NavbarItem[];
  text?: string[];
}

export interface NavbarBrand {
  text?: string;
  link?: string | any[] | null | undefined;
  img?: string;
}

export interface NavbarItem {
  text: string;
  link: string | any[] | null | undefined;
}
