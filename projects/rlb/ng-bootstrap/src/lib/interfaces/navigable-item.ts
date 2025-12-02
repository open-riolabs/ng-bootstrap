export interface NavigableItem {
  label?: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  url?: any[] | string | null | undefined;
  externalUrl?: string;
}

export interface SidebarNavigableItem extends NavigableItem {
  items?: SidebarNavigableItem[];
  title?: string;
	badgeCounter?: number;
}
