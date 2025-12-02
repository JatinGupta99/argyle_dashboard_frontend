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
import { Calendar, ChevronRight, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
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
      <SidebarContent className="mt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2 px-4 text-xs font-semibold text-black">Main Menu</div>

          <SidebarMenu className="space-y-2 pl-3">
            {/* Event Schedule */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/dashboard/schedule/card')}
                className={cn(
                  'flex cursor-pointer items-center justify-between transition',
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
              <div className="mt-1 flex flex-col space-y-1 pl-6">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => router.push(`/dashboard/events/${params.eventId}`)}
                    className="text-sm font-bold text-sky-300"
                  >
                    {params.eventId.slice(0, 8)}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            )}

            {/* Users */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push('/dashboard/users')}
                className={cn(
                  'flex cursor-pointer items-center justify-between transition',
                  pathname.startsWith('/dashboard/users') && 'bg-muted text-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  Users
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

               <SidebarFooter className="pb-8 pl-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-md text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarFooter>
          </SidebarMenu>

        
        </div>

        {/* Footer with Logout */}
       
      </SidebarContent>
    </Sidebar>
  );
}
