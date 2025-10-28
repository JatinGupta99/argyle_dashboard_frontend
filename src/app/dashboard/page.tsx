'use client';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';
import MonthlyScheduleSummary from '@/components/dashboard/MonthlyScheduleSummary';
import { ScheduleTabs } from '@/components/dashboard/ScheduleTabs';
import { AppSidebar } from '@/components/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const user = {
    name: 'John Doe',
    role: 'Staff',
    avatar: '/images/avatar.png',
  };
  const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
  };
  const handleExport = ({ fromDate, toDate }: { fromDate: string; toDate: string }) => {
    console.log('Export clicked:', { fromDate, toDate });
    // Fetch or download logic here
  };

  const handleFilter = () => console.log('Filter clicked');
  const handleCard = () => console.log('Card clicked');
  return (
    <SidebarProvider>
      {/* Use gap for spacing */}
      <div className="bg-muted/10 flex h-screen gap-18">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader user={user} />
          <DashboardToolbar
            exportLabel="Export"
            onExportClick={handleExport}
            onFilterClick={handleFilter}
            onCardClick={handleCard}
            defaultFromDate="2025-10-01"
            defaultToDate="2025-10-31"
          />
          <MonthlyScheduleSummary
            month={scheduleData.month}
            scheduleCount={scheduleData.scheduleCount}
          />
          <div className="flex-1 overflow-auto">
            <ScheduleTabs />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
