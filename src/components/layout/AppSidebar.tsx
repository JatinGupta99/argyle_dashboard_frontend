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
import { Calendar, FileText, LayoutGrid, LogOut, Settings, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// ✅ Config-driven sidebar menu
const mainMenu = [
  {
    title: 'Event Schedule',
    icon: Calendar,
    href: '/dashboard/schedule',
  },
  {
    title: 'Event Content',
    icon: LayoutGrid,
    children: [
      { title: 'Agenda', href: '/dashboard/agenda' },
      { title: 'Speaker', href: '/dashboard/speakers' },
    ],
  },
  {
    title: 'Post Event Analytic',
    icon: FileText,
    href: '/dashboard/analytics',
  },
];

const otherMenu = [
  { title: 'Setting', icon: Settings },
  { title: 'Logout', icon: LogOut, danger: true },
];

export function AppSidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (href?: string) => {
    if (href) router.push(href);
  };

  return (
    <Sidebar className="flex h-screen w-64 flex-col bg-white">
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

        <div className="space-y-8 pl-4">
          <SidebarMenu>
            {mainMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isOpen = openDropdown === item.title;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() =>
                      item.children
                        ? setOpenDropdown(isOpen ? null : item.title)
                        : handleNavigate(item.href)
                    }
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                      'hover:bg-muted/40',
                      isActive && 'bg-blue-50 font-semibold text-blue-600'
                    )}
                  >
                    <Icon size={16} />
                    {item.title}
                    {item.children && (
                      <ChevronDown
                        size={16}
                        className={cn('ml-auto transition-transform', isOpen && 'rotate-180')}
                      />
                    )}
                  </SidebarMenuButton>

                  {item.children && isOpen && (
                    <div className="text-muted-foreground mt-1 ml-8 space-y-1 text-sm">
                      {item.children.map((child) => {
                        const activeChild = pathname === child.href;
                        return (
                          <button
                            key={child.title}
                            onClick={() => handleNavigate(child.href)}
                            className={cn(
                              'hover:text-foreground block w-full px-2 py-1 text-left',
                              activeChild && 'font-medium text-blue-600'
                            )}
                          >
                            {child.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* Footer / Other Menu */}
      {/* <SidebarFooter className="mt-auto px-4 mr-3">
        <div className="mb-2 text-xs font-semibold text-black">Other</div>
        <SidebarMenu>
          {otherMenu.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => item.title === 'Logout' && router.push('/login')}
                  className={cn(
                    'hover:bg-muted/40 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                    item.danger && 'text-red-500 hover:bg-red-50'
                  )}
                >
                  <Icon size={16} />
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
