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
import { Calendar, LogOut, Settings, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useParams } from 'next/navigation';
import React from 'react';

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams(); // get eventId from URL
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const isEventPage = pathname.startsWith('/dashboard/events');

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
          {/* Event Schedule parent */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => router.push('/dashboard/schedule/card')}
              className={cn(
                'cursor-pointer transition flex justify-between items-center',
                pathname.startsWith('/dashboard/schedule') && 'bg-muted text-primary'
              )}
            >
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                Event Schedule
              </div>
              {params?.eventId && (
                <ChevronRight
                  size={16}
                  className={cn('transition-transform', isEventPage && 'rotate-90')}
                />
              )}
            </SidebarMenuButton>

            
          </SidebarMenuItem>
          

          {params?.eventId && (
            <div className="pl-6 mt-1 flex flex-col space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() =>
                    router.push(`/dashboard/events/${params.eventId}`)
                  }
                  className="text-sm font-bold text-sky-300"
                >
                  {params.eventId.slice(0, 8)} 
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          )}

          <SidebarMenuItem>
  <SidebarMenuButton
    onClick={() => router.push('/dashboard/users')}
    className={cn(
      'cursor-pointer transition flex justify-between items-center',
      pathname.startsWith('/dashboard/users') && 'bg-muted text-primary'
    )}
  >
    <div className="flex items-center gap-2">
      <Settings size={16} /> {/* You can change icon if needed */}
      Users
    </div>
  </SidebarMenuButton>
</SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <div className="mt-auto mb-2 px-4 text-xs font-semibold text-black">Other</div>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => router.push('/dashboard/settings')}
            className="hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition"
          >
            <Settings size={16} /> Setting
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleLogout}
            className="hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
