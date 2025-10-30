'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SidebarProvider className="">
        <AppSidebar />
        <main className="h-full w-full">{children}</main>
      </SidebarProvider>
    </Provider>
  );
}
