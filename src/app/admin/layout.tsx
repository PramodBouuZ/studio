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
import { LayoutDashboard, ShoppingCart, Users, LifeBuoy, LogOut, Megaphone, Presentation, Shield, Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import AdminAIChat from '@/components/admin/admin-ai-chat';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingCart },
  { href: '/admin/vendors', label: 'Vendors', icon: Users },
  { href: '/admin/hero-banner', label: 'Hero Banner', icon: Presentation },
  { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
];

const bottomMenuItems = [
    { href: '/admin/support', label: 'Support', icon: LifeBuoy },
    { href: '/', label: 'Logout', icon: LogOut },
]

// Define the authorized admin email
const ADMIN_EMAIL = 'admin@bantconfirm.com';

export default function AdminLayout({ children }: { children: React.React.Node }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user data is still loading, do nothing yet.
    if (isUserLoading) {
      return;
    }

    // If there is no user, or the user is not the admin, redirect.
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace('/'); // Redirect to homepage
    }
  }, [user, isUserLoading, router]);

  // While loading or if the user is not the admin, show a loading/access denied screen
  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          {isUserLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying access...</p>
            </>
          ) : (
             <>
                <Shield className="h-8 w-8 text-destructive" />
                <h1 className="text-xl font-semibold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Button onClick={() => router.push('/')}>Go to Homepage</Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // If the user is the admin, render the admin layout
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
