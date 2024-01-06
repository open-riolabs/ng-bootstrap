import { Observable } from 'rxjs';

export interface ClickableItem {
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  action: (() => void | Promise<void> | Observable<void>) | null | undefined;
}
