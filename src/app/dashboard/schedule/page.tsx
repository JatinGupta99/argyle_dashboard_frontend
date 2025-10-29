import { DashboardToolbar } from "@/components/dashboard/DashboardToolBar";
import { ScheduleTabs } from "./components/ScheduleTabs";
import MonthlyScheduleSummary from "@/components/dashboard/MonthlyScheduleSummary";

export default function SchedulePage() {
    const scheduleData = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    scheduleCount: 25,
  };
  return (
  <>
  
  <DashboardToolbar exportLabel="Export"/>
<MonthlyScheduleSummary
            month={scheduleData.month}
            scheduleCount={scheduleData.scheduleCount}
          />
    <ScheduleTabs /></>

  );
}
