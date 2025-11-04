'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import BANTLogo from '@/components/bant-logo';
import { LayoutDashboard, ShoppingCart, Users, LifeBuoy, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import AdminAIChat from '@/components/admin/admin-ai-chat';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingCart },
  { href: '/admin/vendors', label: 'Vendors', icon: Users },
];

const bottomMenuItems = [
    { href: '/admin/support', label: 'Support', icon: LifeBuoy },
    { href: '/', label: 'Logout', icon: LogOut },
]

export default function AdminLayout({ children }: { children: React.React.Node }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <BANTLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarContent className="flex-grow-0">
          <SidebarMenu>
          {bottomMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        <AdminAIChat />
      </SidebarInset>
    </SidebarProvider>
  );
}
