export interface CarouselSlide {
  image?: string;
  title?: string;
  content?: string;
}

export interface Carousel {
  showIndicators?: boolean;
  showControls?: boolean;
  crossFade?: boolean;
  autoplay?: 'auto' | 'manual' | 'none';
  interval?: number;
  pauseProp?: false | 'hover';
  wrap?: boolean;
  noTouch?: boolean;
  keyboard?: boolean;
  slides: CarouselSlide[];
}
