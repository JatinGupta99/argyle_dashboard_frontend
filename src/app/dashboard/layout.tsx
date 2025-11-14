'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <main className="h-full w-full">{children}</main>
      </SidebarProvider>
    </Provider>
  );
}
