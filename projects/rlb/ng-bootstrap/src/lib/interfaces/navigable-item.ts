export interface NavigableItem {
  label?: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  url: any[] | string | null | undefined;
}

export interface SidebarNavigableItem extends NavigableItem {
  items?: SidebarNavigableItem[];
  title?: string;
}
