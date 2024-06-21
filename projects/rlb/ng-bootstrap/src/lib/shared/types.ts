export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
export type Size = 'sm' | 'md' | 'lg';
export type TextAlignment = 'left' | 'center' | 'right';
export type VisibilityEventBase =
  | 'show'
  | 'shown'
  | 'hide'
  | 'hidden'
export type VisibilityEvent = VisibilityEventBase | 'hidePrevented';
export type ModalCloseReason = 'ok' | 'cancel' | 'close';
export type ToastCloseReason = 'ok' | 'cancel' | 'close';
export type ModalType = 'success' | 'info' | 'warning' | 'error';
