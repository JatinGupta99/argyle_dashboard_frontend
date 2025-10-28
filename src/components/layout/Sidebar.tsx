'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Calendar, FileText, LayoutGrid, LogOut, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const [openContent, setOpenContent] = useState(false);

  return (
    <Sidebar className="flex w-56 flex-col border-r bg-white">
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

      {/* Main Content */}
      <SidebarContent className="mt-6 flex-1">
        <div className="mb-2 px-4 text-xs font-semibold text-black">Main Menu</div>

        <div className="space-y-8 pl-4">
          <SidebarMenu>
            {/* Event Schedule */}
            <SidebarMenuItem>
              <SidebarMenuButton
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
                  'hover:bg-muted/40 transition',
                  'bg-blue-50 font-semibold text-blue-600'
                )}
              >
                <Calendar size={16} />
                Event Schedule
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Event Content Dropdown */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenContent(!openContent)}
                className="hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition"
              >
                <LayoutGrid size={16} />
                Event Content
                <ChevronDown
                  size={16}
                  className={cn('ml-auto transition-transform', openContent && 'rotate-180')}
                />
              </SidebarMenuButton>
              {openContent && (
                <div className="text-muted-foreground mt-1 ml-8 space-y-1 text-sm">
                  <button className="hover:text-foreground block w-full px-2 py-1 text-left">
                    Updates
                  </button>
                  <button className="hover:text-foreground block w-full px-2 py-1 text-left">
                    Agenda
                  </button>
                  <button className="hover:text-foreground block w-full px-2 py-1 text-left">
                    Info
                  </button>
                </div>
              )}
            </SidebarMenuItem>

            {/* Post Event Analytic */}
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition">
                <FileText size={16} />
                Post Event Analytic
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        {/* Other Section Title */}
      </SidebarContent>

      {/* Footer (bottom section) */}
      <div className="mt-6 mb-2 px-4 text-xs font-semibold text-black">Other</div>
      <SidebarFooter className="pt-3 pb-8 pl-4">
        {' '}
        {/* Increased pb-6 */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition">
              <Settings size={16} />
              Setting
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50">
              <LogOut size={16} />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
