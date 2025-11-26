'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Calendar, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const mainMenu = [
  {
    title: 'Event Schedule',
    icon: Calendar,
    href: '/dashboard/schedule/card',
  },
];

const otherMenu = [
  { title: 'Setting', icon: Settings, href: '/dashboard/settings' },
  { title: 'Logout', icon: LogOut, danger: true },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleMenuClick = async (item: any) => {
    if (item.title === 'Logout') {
      await logout();
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <Sidebar className="flex w-64 flex-col border-r bg-white">
      {/* Header */}
      <SidebarHeader className="flex h-20 items-start justify-start p-5">
        <Image
          src="/images/argyle-logo.png"
          alt="Argyle"
          width={120}
          height={40}
          className="object-contain"
        />
      </SidebarHeader>

      {/* Main Menu */}
      <SidebarContent className="mt-6 flex-1">
        <div className="mb-2 px-4 text-xs font-semibold text-black">Main Menu</div>

        <SidebarMenu className="space-y-2 pl-3">
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => handleMenuClick(item)}
                  className={cn('cursor-pointer transition', isActive && 'bg-muted text-primary')}
                >
                  <Icon size={16} />
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto mb-2 px-4 text-xs font-semibold text-black">Other</div>
      <SidebarFooter>
        {otherMenu.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={async () => {
                if (item.title === 'Logout') {
                  await logout(); // ✅ use context logout here
                } else if (item.title === 'Setting') {
                  router.push('/dashboard/settings');
                }
              }}
              className={cn(
                'hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                item.danger && 'text-red-500 hover:bg-red-50',
              )}
            >
              <item.icon size={16} />
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarFooter>
    </Sidebar>
  );
}
