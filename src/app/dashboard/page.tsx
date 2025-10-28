import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { ScheduleTabs } from '@/components/dashboard/ScheduleTabs';
import { AppSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      {/* Use gap for spacing */}
      <div className="bg-muted/10 flex h-screen gap-18">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
            <DashboardToolbar />
            <MonthlyScheduleSummary/>
          <div className="flex-1 overflow-auto">
            <ScheduleTabs />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
