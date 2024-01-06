import { Color, TextAlignment } from '@rlb/ng-bootstrap';

export interface CardAction {
  text: string;
  link: string;
}

export interface Card {
  align: TextAlignment;
  background: Color;
  border: Color;
  header?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  image?: Image;
  footer?: string;
  color?: Color;
  width?: number;
  overlay?: boolean;
  actions?: CardAction[];
}

export interface Image {
  src: string;
  alt?: string;
}
