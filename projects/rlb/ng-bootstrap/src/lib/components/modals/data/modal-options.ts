export interface ModalOptions {
  backdrop?: boolean | 'static';
  scrollable?: boolean;
  verticalcentered?: boolean;
  animation?: boolean;
  size?: 'sm' | 'lg' | 'xl' | 'md';
  fullscreen?:
  | boolean
  | 'sm-down'
  | 'md-down'
  | 'lg-down'
  | 'xl-down'
  | 'xxl-down';
  focus?: boolean;
  keyboard?: boolean;
}
