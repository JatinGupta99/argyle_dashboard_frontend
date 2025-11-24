'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { store } from '@/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Provider } from 'react-redux';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <div className="fixed top-0 left-0 h-screen w-10 border-r bg-white">
            <AppSidebar />
          </div>
          <main className="ml-64 h-full w-full flex-1 overflow-y-auto bg-gray-50">{children}</main>
        </SidebarProvider>
      </QueryClientProvider>
    </Provider>
  );
}
