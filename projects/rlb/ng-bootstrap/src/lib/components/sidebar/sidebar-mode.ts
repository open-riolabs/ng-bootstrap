export type SidebarMode = 'user' | 'logo' | 'custom';

export interface HeaderLogo {
  text: string;
  image: string;
  alt?: string;
}

export interface HeaderUser {
  image: string;  
  username: string;
  role: string;
  logo: string;
}