import { IconHome, IconUser, IconSettings } from "@tabler/icons-react";

export interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: <IconHome size={20} />, path: "/main/dashboard" },
  { label: "Profile", icon: <IconUser size={20} />, path: "/main/profile" },
  { label: "Settings", icon: <IconSettings size={20} />, path: "/main/settings" },
];

export interface FooterItem {
  label: string;
  path: string;
}

export const footerItems: FooterItem[] = [
  { label: "Tab 1", path: "/main/dashboard/tab1" },
  { label: "Tab 2", path: "/main/dashboard/tab2" },
];