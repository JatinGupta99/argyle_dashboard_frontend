import { DashboardToolbar } from '@/components/dashboard/DashboardToolBar';

export default function DashboardHome() {
  return (
    <>
    <DashboardToolbar/>
      <div className="text-muted-foreground p-6">
        Welcome to your dashboard! Choose a section from the sidebar.
      </div></>
  );
}
