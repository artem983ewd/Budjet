import { IconHome, IconUser, IconSettings, IconWallet, IconCreditCard, IconShoppingCart, IconReceipt, IconChartBar } from "@tabler/icons-react";

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
  icon: React.ReactNode;
  path: string;
}

export const footerItems: FooterItem[] = [
  { icon: <IconWallet size={20} />, path: "/main/dashboard/tab1" },
  { icon: <IconShoppingCart size={20} />, path: "/main/dashboard/tab2" },
  { icon: <IconCreditCard size={20} />, path: "/main/dashboard/accounts" },
  { icon: <IconReceipt size={20} />, path: "/main/dashboard/debts" },
  { icon: <IconChartBar size={20} />, path: "/main/dashboard/analytics" },
];