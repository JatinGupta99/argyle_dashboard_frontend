import { DashboardToolbar } from "@/components/dashboard/DashboardToolBar";

export default function DashboardHome() {
  return (
    <DashboardToolbar exportLabel="Dashboard">
      <div className="p-6 text-muted-foreground">
        Welcome to your dashboard! Choose a section from the sidebar.
      </div>
    </DashboardToolbar>
    
  );
}
